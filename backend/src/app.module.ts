// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';  
import { PrismaService } from './prisma/prisma.service';  
import { ClientsModule } from './clients/clients.module';


@Module({
  imports: [UsersModule, ClientsModule],  
  controllers: [AppController],
  providers: [AppService, PrismaService],  // Si PrismaService está en un módulo separado, lo añadimos a providers
})
export class AppModule {}
