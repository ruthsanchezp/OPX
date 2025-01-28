import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los clientes con sus acuerdos
  async findAll() {
    try {
      console.log('Fetching all clients with agreements...');
      return await this.prisma.client.findMany({
        include: { agreements: true },
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Obtener un cliente por ID con sus acuerdos
  // Obtener un cliente por ID con sus acuerdos
async findOne(id: number | string) {
  try {
    console.log(`Fetching client with ID: ${id}`);
    
    // Convertir el id a número si es una cadena
    const clientId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(clientId)) {
      throw new Error(`Invalid client ID: ${id}`);
    }

    const client = await this.prisma.client.findUnique({
      where: { client_id: clientId },
      include: { agreements: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    console.log('Client found:', client);
    return client;
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw error;
  }
}

  // Crear un cliente con acuerdos
  async create(createClientDto: CreateClientDto) {
    try {
      const { agreements, ...clientData } = createClientDto;

      console.log('Creating client with data:', clientData);
      if (agreements) {
        console.log('Creating agreements:', agreements);
      }

      return await this.prisma.client.create({
        data: {
          ...clientData,
          agreements: agreements
            ? {
                create: agreements.map((agreement) => ({
                  agreement_type: agreement.agreement_type || 'General', // Tipo predeterminado
                  start_date: agreement.start_date
                    ? new Date(agreement.start_date)
                    : new Date('1111-01-01'), // Fecha predeterminada
                  end_date: agreement.end_date
                    ? new Date(agreement.end_date)
                    : new Date('9999-12-31'), // Fecha predeterminada
                  status: agreement.status || 'Pendiente', // Estado predeterminado
                  total_amount: agreement.total_amount ?? 0, // Monto predeterminado
                  total_installments: agreement.total_installments ?? 0, // Cuotas predeterminadas
                })),
              }
            : undefined,
        },
        include: { agreements: true },
      });
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Actualizar un cliente con acuerdos
  async update(id: number, updateClientDto: UpdateClientDto) {
    const clientId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(clientId)) {
      throw new Error('Invalid client ID');
    }
    try {
      const { agreements, ...clientData } = updateClientDto;

      console.log(`Updating client with ID: ${id}`);
      if (agreements) {
        console.log('Updating agreements:', agreements);
      }

      return await this.prisma.client.update({
        where: { client_id: clientId },
        data: {
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          id_fiscal: clientData.id_fiscal,
          phone: clientData.phone,
          email: clientData.email,
          address: clientData.address,
          city: clientData.city,
          country: clientData.country,
          birth_date: clientData.birth_date,
          agreements: agreements
            ? {
                upsert: agreements.map((agreement) => ({
                  where: { agreement_id: agreement.agreement_id ?? -1 },
                  update: {
                    agreement_type: agreement.agreement_type || 'General',
                    start_date: agreement.start_date
                      ? new Date(agreement.start_date)
                      : new Date('1111-01-01'),
                    end_date: agreement.end_date
                      ? new Date(agreement.end_date)
                      : new Date('9999-12-31'),
                    status: agreement.status || 'Pendiente',
                    total_amount: agreement.total_amount ?? 0,
                    total_installments: agreement.total_installments ?? 0,
                  },
                  create: {
                    agreement_type: agreement.agreement_type || 'General',
                    start_date: agreement.start_date
                      ? new Date(agreement.start_date)
                      : new Date('1111-01-01'),
                    end_date: agreement.end_date
                      ? new Date(agreement.end_date)
                      : new Date('9999-12-31'),
                    status: agreement.status || 'Pendiente',
                    total_amount: agreement.total_amount ?? 0,
                    total_installments: agreement.total_installments ?? 0,
                  },
                })),
              }
            : undefined,
        },
        include: { agreements: true },
      });
      
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un cliente y sus acuerdos
  async delete(id: number | string) {
    try {
      console.log(`Deleting client with ID: ${id}`);
  
      // Asegúrate de convertir id a número si llega como string
      const clientId = typeof id === 'string' ? parseInt(id, 10) : id;
  
      const client = await this.prisma.client.findUnique({
        where: { client_id: clientId },
      });
  
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
  
      return await this.prisma.client.delete({
        where: { client_id: clientId },
      });
    } catch (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw error;
    }
  }
}  