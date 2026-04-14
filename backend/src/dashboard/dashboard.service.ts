import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats(gymId: string) {
    const totalMembers = await this.prisma.user.count({ where: { gymId, role: 'MEMBER' } });
    
    // Fetch users for demographics
    const usersDemographics = await this.prisma.user.findMany({
      where: { gymId, role: 'MEMBER' },
      select: { gender: true }
    });

    const memberships = await this.prisma.membership.findMany({
      where: { user: { gymId, role: 'MEMBER' } },
      include: { plan: true }
    });

    const payments = await this.prisma.payment.findMany({
      where: { user: { gymId, role: 'MEMBER' } }
    });

    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    let active = 0;
    let expired = 0;
    let expiringSoon = 0;
    let totalRevenue = 0;

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

    // Analytics processing
    const revenueMap = new Map<string, number>();
    payments.forEach((p: any) => {
      totalRevenue += p.amount;
      const monthYear = p.date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      revenueMap.set(monthYear, (revenueMap.get(monthYear) || 0) + p.amount);
    });

    const genderMap = new Map<string, number>();
    usersDemographics.forEach((u: any) => {
      const gender = u.gender || 'Other';
      genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
    });

    const planMap = new Map<string, number>();
    memberships.forEach((m: any) => {
      if (m.plan && m.plan.name) {
        planMap.set(m.plan.name, (planMap.get(m.plan.name) || 0) + 1);
      }
    });

    return { 
      totalMembers, 
      activeMembers: active, 
      expiredMembers: expired, 
      expiringSoon, 
      totalRevenue,
      revenueTrend: Array.from(revenueMap.entries()).map(([name, revenue]) => ({ name, revenue })).reverse(), // Simplistic sort assuming chronological DB output
      genderDistribution: Array.from(genderMap.entries()).map(([name, count]) => ({ name, count })),
      planDistribution: Array.from(planMap.entries()).map(([name, count]) => ({ name, count }))
    };
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
