import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Marca el módulo como global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta PrismaService
})
export class PrismaModule {}
