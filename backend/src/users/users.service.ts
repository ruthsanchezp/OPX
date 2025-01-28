import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService para interactuar con la base de datos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; // Librería para encriptar la contraseña

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
    // users.service.ts
   async remove(id: number) {
    const userId = parseInt(id as any, 10); // Convertir ID a número si es necesario
     return this.prisma.user.delete({
  where: { id: userId },
    });
  }
  
  // Método para obtener todos los usuarios
  async findAll() {
    return this.prisma.user.findMany();  // Prisma obtiene todos los usuarios
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Verificar que el id es un número
      console.log('Updating user with id:', id);  // Verifica que id es un número
      if (isNaN(id)) {
        throw new Error('El id proporcionado no es un número válido');
      }
  
      const userId = parseInt(id.toString(), 10);  // Convierte el id a número
  
      return await this.prisma.user.update({
        where: {
          id: userId,  // Usamos userId convertido a número
        },
        data: updateUserDto,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }  
  
// Método para obtener un usuario por ID
async findOne(id: number) {
  const userId = parseInt(id as any, 10); // Parsear a número si es necesario
  return this.prisma.user.findUnique({
    where: { id: userId },
  });
}

  // Método para crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    const { name, role, email, phone, address, city, password } = createUserDto;

    // Verificar si el email ya está registrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        name,
        role,
        email,
        phone,
        address,
        city,
        password: hashedPassword, // Guardamos la contraseña encriptada
      },
    });
  }
}
