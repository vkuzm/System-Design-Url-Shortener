import { Injectable } from '@nestjs/common';
import UserRequestDto from '../dto/userRequest.dto';
import User from '../model/user.model';

@Injectable()
export class UserRepository {
  private readonly database = new Map<number, User>();
  private sequence: number = 1;

  createUser(userRequestDto: UserRequestDto): User {
    const userId = this.sequence++;

    if (this.isEmailExisted(userRequestDto.email)) {
      throw new Error(`Email ${userRequestDto.email} is already registered`);

    } else {
      this.database.set(userId, {
        userId: userId,
        email: userRequestDto.email,
        password: userRequestDto.password // TODO encrypt the password
      });

      return this.database.get(userId);
    }
  }

  findUserById(userId: number): User {
    return this.database.get(userId);
  }

  findAllUsers(): User[] {
    return Array.from(this.database.values());
  }

  private isEmailExisted(email: string): boolean {
    const user = Array.from(this.database.values()).find((user) => user.email === email);
    return !!user;
  }
}
