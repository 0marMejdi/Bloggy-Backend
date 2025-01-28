import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { Roles } from "../auth/roles/roles.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Get("isvalid/:emailorpassword")
  async isValid(@Param("emailorpassword") emailorpassword : string){
    return this.usersService.isValid(emailorpassword);
  }
  @Get("infos")
  @UseGuards(JwtAuthGuard) // Assuming AuthGuard is your authentication guard
  async whoami(@CurrentUser() user) {
    return user;
  }

  @Patch("infos")
  @UseGuards(JwtAuthGuard)
  async changeInfos(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.update(user.id, updateUserDto);
  }
  @Get("serch/:name")
  async searchByName(@Param('name') name:string){
    return this.usersService.searchByName(name);
  }
  @Patch("infos/password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(user, changePasswordDto);
    return { message: "password changed" };
  }


  @Get("email/:email")
  findOneByEmail(@Param("email") email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }
  @Get("username/:username")
  findOneByUserName(@Param("username") username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get()
  async findAll(
    @Query("transform")
    transform: boolean,
  ) {
    return this.usersService.findAll(Boolean(transform));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
    return User.clean(await this.usersService.findOne(id));
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
