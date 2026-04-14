import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async registerAdmin(data: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const existingSubdomain = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
    if (existingSubdomain) {
      throw new ConflictException('Subdomain already taken');
    }

    // Create Gym and Admin
    const gym = await this.prisma.gym.create({
      data: {
        name: data.gymName,
        subdomain: data.subdomain,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
        gymId: gym.id,
      },
    });

    await this.mailService.sendWelcomeEmail(user.email, null, 'ADMIN', undefined, gym.name);

    return { message: 'Admin and Gym registered successfully' };
  }

  async registerMember(data: any) {
    const gym = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
    if (!gym) throw new UnauthorizedException('Invalid gym subdomain');

    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
        phone: data.phone || null,
        gender: data.gender || null,
        role: 'MEMBER',
        gymId: gym.id,
      },
    });

    let months = 1;
    let planId = null;

    if (data.planId) {
      const plan = await this.prisma.plan.findUnique({ where: { id: data.planId } });
      if (plan && plan.gymId === gym.id) {
        months = plan.durationMonths;
        planId = plan.id;
      }
    } else if (data.planMonths) {
      months = parseInt(data.planMonths || '1');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        planId,
        startDate,
        endDate,
        status: 'ACTIVE',
      }
    });

    await this.mailService.sendWelcomeEmail(user.email, user.name, 'MEMBER', undefined, gym.name);

    return { message: 'Member registered successfully' };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({ 
      where: { email: data.email },
      include: { gym: true }
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (data.subdomain && user.gym?.subdomain !== data.subdomain) {
      throw new UnauthorizedException('Invalid gym subdomain');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, gymId: user.gymId };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
