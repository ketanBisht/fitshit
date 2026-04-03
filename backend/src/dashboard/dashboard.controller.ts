import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('ADMIN')
  @Get('admin')
  async getAdminStats(@Request() req: any) {
    return this.dashboardService.getAdminStats(req.user.gymId);
  }

  @Roles('MEMBER')
  @Get('member')
  async getMemberStats(@Request() req: any) {
    return this.dashboardService.getMemberStats(req.user.userId);
  }
}
