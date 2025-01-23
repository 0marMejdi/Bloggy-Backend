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
    return res.redirect('/uploads/index.html');

  }

}
