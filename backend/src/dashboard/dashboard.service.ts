import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats(gymId: string) {
    const totalMembers = await this.prisma.user.count({ where: { gymId, role: 'MEMBER' } });
    
    const memberships = await this.prisma.membership.findMany({
      where: { user: { gymId, role: 'MEMBER' } }
    });

    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    let active = 0;
    let expired = 0;
    let expiringSoon = 0;

    memberships.forEach((m: any) => {
      if (m.endDate < now) {
        expired++;
      } else {
        active++;
        if (m.endDate <= sevenDaysFromNow) {
          expiringSoon++;
        }
      }
    });

    return { totalMembers, activeMembers: active, expiredMembers: expired, expiringSoon };
  }

  async getMemberStats(userId: string) {
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        gym: { 
          select: { 
            name: true, 
            announcements: { orderBy: { createdAt: 'desc' }, take: 5 } 
          } 
        },
        membership: {
          include: { plan: true }
        }
      }
    });

    if (!user?.membership) return { message: 'No active membership', status: 'NONE', gym: user?.gym };

    const membership = user.membership;
    const now = new Date();
    const diffTime = new Date(membership.endDate).getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let status = 'ACTIVE';
    if (daysRemaining === 0) status = 'EXPIRED';

    return { status, daysRemaining, expiryDate: membership.endDate, startDate: membership.startDate, plan: membership.plan, gym: user.gym, phone: user.phone };
  }
}
