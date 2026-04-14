import { Controller, Post, Body, Get, Delete, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    console.log('--- PROFILE REQUEST ---');
    console.log('User ID from Request:', req.user.userId);
    const profile = await this.usersService.getProfile(req.user.userId);
    console.log('Profile Data Found:', !!profile);
    return profile;
  }

  @Patch('profile')
  async updateProfile(@Body() body: any, @Request() req: any) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Post('change-password')
  async changePassword(@Body() body: any, @Request() req: any) {
    return this.usersService.changePassword(req.user.userId, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createMember(@Body() body: any, @Request() req: any) {
    return this.usersService.createMember(body, req.user.gymId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('bulk')
  async createBulkMembers(@Body() data: any[], @Request() req: any) {
    return this.usersService.createMembersBulk(data, req.user.gymId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getMembers(@Request() req: any) {
    return this.usersService.getMembers(req.user.gymId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteMember(@Param('id') id: string, @Request() req: any) {
    return this.usersService.deleteMember(req.user.gymId, id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async getMember(@Param('id') id: string, @Request() req: any) {
    return this.usersService.getMemberAdmin(req.user.gymId, id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateMember(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.usersService.updateMemberAdmin(req.user.gymId, id, body);
  }

}
