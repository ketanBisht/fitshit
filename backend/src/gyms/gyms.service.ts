import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GymsService {
  constructor(private prisma: PrismaService) {}

  async getGymBySubdomain(subdomain: string) {
    const gym = await this.prisma.gym.findUnique({
      where: { subdomain },
      select: { id: true, name: true, subdomain: true, description: true, facilities: true, instagram: true, timing: true, address: true }
    });
    
    if (!gym) throw new NotFoundException('Gym not found');
    return gym;
  }

  async getGymInfo(gymId: string) {
    return this.prisma.gym.findUnique({ where: { id: gymId } });
  }

  async updateGym(gymId: string, data: { description: string; facilities: string; name: string; instagram?: string; timing?: string; address?: string }) {
    return this.prisma.gym.update({
      where: { id: gymId },
      data: {
        name: data.name,
        description: data.description,
        facilities: data.facilities,
        instagram: data.instagram,
        timing: data.timing,
        address: data.address
      }
    });
  }

  async getAnnouncements(gymId: string) {
    return this.prisma.announcement.findMany({
      where: { gymId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAnnouncement(gymId: string, content: string) {
    const announcement = await this.prisma.announcement.create({
      data: { gymId, content }
    });

    // MOCK EMAIL NOTIFICATION SYSTEM FOR ALL MEMBERS
    const members = await this.prisma.user.findMany({ where: { gymId, role: 'MEMBER' } });
    const gym = await this.prisma.gym.findUnique({ where: { id: gymId } });
    
    console.log(`\n================= EMAIL DISPATCH =================`);
    console.log(`[Gym]: ${gym?.name}`);
    console.log(`[Subject]: New Announcement from ${gym?.name}`);
    console.log(`[Content]: "${content}"`);
    console.log(`[Recipients]: ${members.length} members`);
    members.forEach(m => console.log(` - Sent to: ${m.email} / ${m.phone || 'no phone'}`));
    console.log(`==================================================\n`);

    return announcement;
  }

  async deleteAnnouncement(gymId: string, announcementId: string) {
    // Only delete if it belongs to this gym
    const exists = await this.prisma.announcement.findFirst({ where: { id: announcementId, gymId } });
    if (!exists) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.delete({ where: { id: announcementId } });
  }

  async getPlans(gymId: string) {
    return this.prisma.plan.findMany({
      where: { gymId },
      orderBy: { price: 'asc' }
    });
  }

  async getPlansBySubdomain(subdomain: string) {
    const gym = await this.prisma.gym.findUnique({ where: { subdomain } });
    if (!gym) throw new NotFoundException('Gym not found');
    return this.getPlans(gym.id);
  }

  async createPlan(gymId: string, data: { name: string; price: number; durationMonths: number; features: string }) {
    return this.prisma.plan.create({
      data: {
        gymId,
        name: data.name,
        price: data.price,
        durationMonths: data.durationMonths,
        features: data.features
      }
    });
  }

  async deletePlan(gymId: string, planId: string) {
    const exists = await this.prisma.plan.findFirst({ where: { id: planId, gymId } });
    if (!exists) throw new NotFoundException('Plan not found');
    return this.prisma.plan.delete({ where: { id: planId } });
  }
}
