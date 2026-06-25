import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: string;
    avatarUrl: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async register(
    email: string,
    senha: string,
    nome: string,
    role: 'ADMIN' | 'PROFISSIONAL' = 'PROFISSIONAL',
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(senha, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        senha: hashedPassword,
        nome,
        role,
      },
    });

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async login(email: string, senha: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const secret = this.config.get<string>('JWT_SECRET');
      if (!secret) throw new Error('JWT_SECRET not configured');
      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nome: true,
        role: true,
        avatarUrl: true,
        criadoEm: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const secret = this.config.get<string>('JWT_SECRET');
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '7d';

    if (!secret) throw new Error('JWT_SECRET not configured');

    return jwt.sign(
      { sub: user.id, email: user.email, role: user.role } as JwtPayload,
      secret,
      { expiresIn },
    );
  }
}
