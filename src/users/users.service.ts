import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository, TypeORMError } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersReppository: Repository<User>,
  ) {}
  public async findUserByEmail(email: string) {
    const user = await this.usersReppository.findOne({ where: { email } });
    return user;
  }
  public async findUserById(userId: string) {
    const user = await this.usersReppository.findOneBy({ id: userId });
    return user;
  }
  public async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.usersReppository.create(createUserDto);
      return await this.usersReppository.save(user);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }
}
