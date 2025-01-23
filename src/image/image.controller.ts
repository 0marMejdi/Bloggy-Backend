import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // Handle the uploaded file
    return {  image: file.filename };
  }
  
}
