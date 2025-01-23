import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import * as fs from "fs";
import { Roles } from "./auth/roles/roles.decorator";

@Controller()
@ApiTags("Genral")
export class AppController {
  constructor(private readonly appService: AppService) {}

}
