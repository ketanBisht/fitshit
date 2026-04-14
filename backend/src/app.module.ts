import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GymsModule } from './gyms/gyms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    GymsModule, 
    DashboardModule,
    MailModule, // Added MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
