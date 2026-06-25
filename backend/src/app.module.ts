import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Core modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

// Feature modules
import { ClientsModule } from './clients/clients.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { InventoryModule } from './inventory/inventory.module';
import { UploadModule } from './upload/upload.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core
    PrismaModule,
    AuthModule,

    // Features
    ClientsModule,
    ProfessionalsModule,
    ServicesModule,
    AppointmentsModule,
    InventoryModule,
    UploadModule,
    FinanceModule,
  ],
  providers: [
    // AuthGuard global — todas as rotas exigem autenticação por padrão.
    // Use o decorator @Public() para tornar rotas públicas.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
