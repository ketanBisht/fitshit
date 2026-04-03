import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createMember(data: any, adminGymId: string) {
    const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: 'MEMBER',
        gymId: adminGymId,
      },
    });

    if (data.membership) {
      await this.prisma.membership.create({
        data: {
          userId: user.id,
          planId: data.membership.planId,
          startDate: new Date(data.membership.startDate),
          endDate: new Date(data.membership.endDate),
          status: 'ACTIVE',
        },
      });
    }

    return { message: 'Member created successfully', id: user.id };
  }

  async createMembersBulk(members: any[], adminGymId: string) {
    let count = 0;
    for (const member of members) {
      // Basic check to see if email exists already
      const exists = await this.prisma.user.findUnique({ where: { email: member.email } });
      if (!exists) {
        await this.createMember({
          email: member.email,
          phone: member.phone,
          password: member.password || 'welcome123',
          membership: member.planId ? {
            planId: member.planId,
            startDate: member.startDate || new Date().toISOString(),
            endDate: member.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
          } : undefined
        }, adminGymId);
        count++;
      }
    }
    return { message: `Successfully created ${count} members` };
  }

  async getMembers(gymId: string) {
    return this.prisma.user.findMany({
      where: { gymId, role: 'MEMBER' },
      include: { 
        membership: {
          include: { plan: true }
        }
      },
    });
  }
}
