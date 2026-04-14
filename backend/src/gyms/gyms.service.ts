import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class GymsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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

    // EMAIL NOTIFICATION SYSTEM FOR ACTIVE MEMBERS ONLY
    const now = new Date();
    const members = await this.prisma.user.findMany({ 
      where: { 
        gymId, 
        role: 'MEMBER',
        membership: {
          status: 'ACTIVE',
          endDate: { gte: now }
        }
      } 
    });
    const gym = await this.prisma.gym.findUnique({ where: { id: gymId } });
    
    if (gym && members.length > 0) {
      console.log(`[Announcements] Found ${members.length} active members for ${gym.name}. Dispatching emails...`);
      await this.mailService.sendAnnouncementEmails(gym.name, content, members.map(m => m.email));
    } else {
      console.log(`[Announcements] No active members found for ${gym?.name || gymId}. Emails will not be sent.`);
    }

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
