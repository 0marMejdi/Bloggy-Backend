import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import * as fs from "fs";
import { Roles } from "./auth/roles/roles.decorator";

@Controller()
@ApiTags("Genral")
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getDoc(@Res() res){
    let x = fs.readFileSync('uploads/index.html','utf-8');
    res.setHeader('Content-Type', 'text/html'); // Set the content type to HTML

    res.send(x);

  }

}
