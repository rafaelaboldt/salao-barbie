import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  /**
   * Upload de arquivo usando stream (Multer buffer → Streamifier → Cloudinary)
   * Padrão: Multer intercepta o multipart/form-data e salva em memória (buffer).
   * Streamifier converte o buffer em readable stream.
   * Cloudinary recebe o stream via upload_stream.
   */
  uploadFile(
    file: Express.Multer.File,
    folder: string = 'salao-beleza',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload falhou'));
          resolve(result);
        },
      );

      // Converter buffer do multer em readable stream e enviar ao Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Deletar arquivo do Cloudinary por public_id
   */
  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
