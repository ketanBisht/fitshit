import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createMember(data: any, adminGymId: string) {
    const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
        phone: data.phone || null,
        gender: data.gender || null,
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

      if (data.membership.planId) {
        const plan = await this.prisma.plan.findUnique({ where: { id: data.membership.planId } });
        if (plan) {
          await this.prisma.payment.create({
            data: {
              userId: user.id,
              amount: plan.price
            }
          });
          
          const gym = await this.prisma.gym.findUnique({ where: { id: adminGymId } });
          if (gym) {
            await this.mailService.sendPaymentReceiptEmail(user.email, user.name, plan.price, plan.name, gym.name);
          }
        }
      }
    }
    const gym = await this.prisma.gym.findUnique({ where: { id: adminGymId } });
    await this.mailService.sendWelcomeEmail(user.email, user.name, 'MEMBER', data.password || 'password123', gym?.name);

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
          phone: member.phone || null,
          gender: member.gender || null,
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

  async deleteMember(gymId: string, memberId: string) {
    // Basic verification that this member is in this gym
    const member = await this.prisma.user.findFirst({
      where: { id: memberId, gymId }
    });
    
    if (!member) throw new Error('Member not found');
    
    return this.prisma.user.delete({
      where: { id: memberId }
    });
  }
}
