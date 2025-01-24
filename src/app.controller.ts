import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import * as fs from "fs";
import * as path from "path";
import { Roles } from "./auth/roles/roles.decorator";

@Controller()
@ApiTags("Genral")
export class AppController {
  constructor(private readonly appService: AppService) {
  }
  @Get()
  getDoc(@Res() res) {
    try {
      const filePath = path.resolve('uploads/index.html'); // Create an absolute path to the file
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Failed to render the HTML file.');
        }
      });
    } catch (error) {
      console.error('Error rendering the HTML file:', error);
      res.status(500).send('Unexpected server error.');
    }
  }


}
