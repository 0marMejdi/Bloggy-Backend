import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImageService {
   changeImagepath(image: string, articleId: string) {
    const uploadPath = `./uploads/${articleId}`;

    // Check if the upload folder exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });}

 const sourcePath = `./uploads/temp/${image}`;
 const destinationPath = `./uploads/${articleId}/${image}`;
 fs.readFile(sourcePath, (err, data) => {
   if (err) {
     console.error('Error reading file:', err);
     return;
   }
   // Write the file to the destination location
   fs.writeFile(destinationPath, data, (err) => {
     if (err) {
       console.error('Error writing file:', err);
       return;
     }
 
     // Delete the file from the source location
    fs.unlink(sourcePath, (err) => {
     if (err) {
         console.error('Error deleting file:', err);
         return;
     }});});});
  }
}
