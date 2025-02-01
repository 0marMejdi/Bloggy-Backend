import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {NotificationDto} from './dto/notification.dto';
import {filterNotificationDto} from './dto/filterNotification.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  create(@Body() notificationDto: NotificationDto) {
    return this.notificationsService.createNotification(notificationDto);
  }

  /* @Get()
  findAll() {
    return this.notificationsService.findAll();
  } */

  @Get('')
  @UseGuards(JwtAuthGuard)
  async fetchNotificationsPaginate(@CurrentUser() user:User) {
      return await this.notificationsService.fetchNotificationsPaginate(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  /*  @Put(':id')
  update(@Param('id') id: string, @Body() notificationDto: NotificationDto) {
    return this.notificationsService.update(id, notificationDto);
  } */

  @Put('/updates/:id')
  async updateNotificationById(@Param('id') id: string) {
    return await this.notificationsService.updateNotificationById(id);
  }

  @Post('/updates')
  async updateNotificationsByIds(@Body() body) {
    return await this.notificationsService.updateNotificationsByIds(body.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
