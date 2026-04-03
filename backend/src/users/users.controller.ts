import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  async createMember(@Body() body: any, @Request() req: any) {
    return this.usersService.createMember(body, req.user.gymId);
  }

  @Roles('ADMIN')
  @Post('bulk')
  async createBulkMembers(@Body() data: any[], @Request() req: any) {
    return this.usersService.createMembersBulk(data, req.user.gymId);
  }

  @Roles('ADMIN')
  @Get()
  async getMembers(@Request() req: any) {
    return this.usersService.getMembers(req.user.gymId);
  }
}
