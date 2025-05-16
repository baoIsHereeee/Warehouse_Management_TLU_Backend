import { Injectable, BadRequestException } from '@nestjs/common';
import { bucket } from '../../../configs/firebase.config';

@Injectable()
export class FirebaseService {
  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      console.log('Starting file upload...');
      console.log('File details:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      const fileName = `${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(`${path}/${fileName}`);

      console.log('Created file reference:', `${path}/${fileName}`);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
        public: true,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Stream error:', error);
          reject(new BadRequestException(`Failed to upload file: ${error.message}`));
        });

        stream.on('finish', async () => {
          try {
            console.log('File upload finished, getting public URL...');
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}/${fileName}`;
            console.log('File uploaded successfully:', publicUrl);
            resolve(publicUrl);
          } catch (error) {
            console.error('Error getting public URL:', error);
            reject(new BadRequestException(`Failed to get public URL: ${error.message}`));
          }
        });

        if (!file.buffer) {
          console.error('No buffer found in file');
          reject(new BadRequestException('Invalid file buffer'));
          return;
        }

        console.log('Buffer size:', file.buffer.length);

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      if (!url) return;
      
      const fileName = url.split(`${bucket.name}/`)[1];
      if (!fileName) return;

      await bucket.file(fileName).delete();
    } catch (error) {
      console.error('Delete file error:', error);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async updateFile(file: Express.Multer.File, oldUrl: string, path: string): Promise<string> {
    try {
      // Delete old file if exists
      if (oldUrl) {
        await this.deleteFile(oldUrl);
      }

      // Upload new file
      return await this.uploadFile(file, path);
    } catch (error) {
      console.error('Update file error:', error);
      throw new BadRequestException('Failed to update file');
    }
  }
}
