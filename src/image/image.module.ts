import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const articleId = req.params.id || "temp";
          const uploadPath = `./uploads/${articleId}`;
    
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
    
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = (file.originalname).split('.').pop();
          cb(null, `ppp-${require('uuid').v4()}.${ext}`);
        }
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i) || file.size > 3 * 1024 * 1024) {
          console.log("ooh no");
          return callback(new Error('file type or size is not supported (jpg, jpeg, png ,< 3MB)'), false);
        }
        console.log("ooh yes");
        console.log(file);
    
        callback(null, true);
      }
    })
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageModule {}
