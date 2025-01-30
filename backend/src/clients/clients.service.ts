import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Obtener todos los clientes
  async findAll() {
    try {
      console.log('Fetching all clients...');
      return await this.prisma.client.findMany();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Error fetching clients');
    }
  }

  // ✅ Buscar cliente por ID Fiscal
  async findByIdFiscal(idFiscal: string) {
    try {
      console.log(`Searching client by RUT: ${idFiscal}`);
      
      const client = await this.prisma.client.findUnique({
        where: { id_fiscal: idFiscal },
      });
  
      if (!client) {
        console.warn(`Client with RUT ${idFiscal} not found`);
        return null; // Devolver null en lugar de lanzar un error
      }
  
      return client;
    } catch (error) {
      console.error(`Error searching client by RUT ${idFiscal}:`, error);
      throw new Error('Database query failed');
    }
  }
  

  // ✅ Obtener un cliente por ID
  async findOne(id: number | string) {
    try {
      console.log(`Fetching client with ID: ${id}`);

      const clientId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(clientId)) {
        throw new Error(`Invalid client ID: ${id}`);
      }

      const client = await this.prisma.client.findUnique({
        where: { client_id: clientId },
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

  // ✅ Crear un cliente
  async create(createClientDto: CreateClientDto) {
    try {
      console.log('Creating client with data:', createClientDto);

      return await this.prisma.client.create({
        data: {
          ...createClientDto,
        },
      });
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Error creating client');
    }
  }

  // ✅ Actualizar un cliente
  async update(id: number | string, updateClientDto: UpdateClientDto) {
    try {
      console.log(`Updating client with ID: ${id}`);

      const clientId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(clientId)) {
        throw new Error('Invalid client ID');
      }

      return await this.prisma.client.update({
        where: { client_id: clientId },
        data: updateClientDto,
      });
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
  }

  // ✅ Eliminar un cliente
  async delete(id: number | string) {
    try {
      console.log(`Deleting client with ID: ${id}`);

      const clientId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(clientId)) {
        throw new Error('Invalid client ID');
      }

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
