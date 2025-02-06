import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.agreement.findMany();
  }

  async findOne(id: number | string) {
    const agreementId = this.validateId(id);
    const agreement = await this.prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
    });
    if (!agreement) throw new NotFoundException(`Agreement ${agreementId} not found`);
    return agreement;
  }

  async create(createAgreementDto: CreateAgreementDto) {
    try {
      return await this.prisma.agreement.create({
        data: {
          name: createAgreementDto.name, 
          agreement_type: createAgreementDto.agreement_type,
          start_date: createAgreementDto.start_date ? new Date(createAgreementDto.start_date) : null,
          end_date: createAgreementDto.end_date ? new Date(createAgreementDto.end_date) : null,
          status: createAgreementDto.status,
          total_installments: createAgreementDto.total_installments ? parseInt(createAgreementDto.total_installments, 10) : null, // 🔹 Conversión a número
        },
      });
    } catch (error) {
      console.error("Error creating agreement:", error);
      throw new Error("Failed to create agreement. Please check the input data.");
    }
  }
  


  async update(id: number | string, updateAgreementDto: UpdateAgreementDto) {
    const agreementId = this.validateId(id);
    const existingAgreement = await this.prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
    });

    if (!existingAgreement) throw new NotFoundException(`Agreement ${agreementId} not found`);

    return await this.prisma.agreement.update({
      where: { agreement_id: agreementId },
      data: {
        ...updateAgreementDto,
        start_date: updateAgreementDto.start_date ? new Date(updateAgreementDto.start_date) : null,
        end_date: updateAgreementDto.end_date ? new Date(updateAgreementDto.end_date) : null,
      },
    });
  }

  async remove(id: number | string) {
    const agreementId = this.validateId(id);
    const existingAgreement = await this.prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
    });

    if (!existingAgreement) throw new NotFoundException(`Agreement ${agreementId} not found`);

    return await this.prisma.agreement.delete({
      where: { agreement_id: agreementId },
    });
  }

  private validateId(id: number | string): number {
    const parsedId = typeof id === "string" ? parseInt(id, 10) : id;
    if (isNaN(parsedId)) throw new Error(`Invalid ID: ${id}`);
    return parsedId;
  }
}
