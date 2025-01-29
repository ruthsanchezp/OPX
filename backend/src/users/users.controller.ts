// src/users/users.controller.ts
import { Controller, Get, Post, Put, Param, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; // DTO para crear usuario
import { UpdateUserDto } from './dto/update-user.dto'; // DTO para actualizar usuario

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtener todos los usuarios
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Obtener un usuario por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // Actualizar un usuario
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Crear un nuevo usuario
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Eliminar un usuario por ID
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
