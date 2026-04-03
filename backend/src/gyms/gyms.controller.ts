import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get('subdomain/:subdomain')
  async getGymBySubdomain(@Param('subdomain') subdomain: string) {
    return this.gymsService.getGymBySubdomain(subdomain);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('me')
  async getMyGymInfo(@Request() req: any) {
    return this.gymsService.getGymInfo(req.user.gymId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('me')
  async updateMyGym(@Request() req: any, @Body() data: any) {
    return this.gymsService.updateGym(req.user.gymId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('me/announcements')
  async getMyAnnouncements(@Request() req: any) {
    return this.gymsService.getAnnouncements(req.user.gymId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('me/announcements')
  async createAnnouncement(@Request() req: any, @Body('content') content: string) {
    return this.gymsService.createAnnouncement(req.user.gymId, content);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('me/announcements/:id')
  async deleteAnnouncement(@Request() req: any, @Param('id') id: string) {
    return this.gymsService.deleteAnnouncement(req.user.gymId, id);
  }

  @Get('subdomain/:subdomain/plans')
  async getPlansBySubdomain(@Param('subdomain') subdomain: string) {
    return this.gymsService.getPlansBySubdomain(subdomain);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('me/plans')
  async getMyPlans(@Request() req: any) {
    return this.gymsService.getPlans(req.user.gymId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('me/plans')
  async createPlan(@Request() req: any, @Body() data: any) {
    return this.gymsService.createPlan(req.user.gymId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('me/plans/:id')
  async deletePlan(@Request() req: any, @Param('id') id: string) {
    return this.gymsService.deletePlan(req.user.gymId, id);
  }
}
