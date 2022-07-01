import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import UserResponseDto from 'src/dto/userResponse.dto';
import ErrorResponse from 'src/error.response';
import User from 'src/model/user.model';
import UserRequestDto from '../dto/userRequest.dto';
import { UserRepository } from '../repository/user.repository';

@Controller('/users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAllUsers() {
    return this.userRepository.findAllUsers()
      .map((user) => this.toDto(user));
  }

  @Get('/:userId')
  findUser(@Param() params: { userId: string }, @Res() res: Response<UserResponseDto>) {
    const user = this.userRepository.findUserById(parseInt(params.userId));

    if (user) {
      return res.status(HttpStatus.OK).send(user);
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('/register')
  createUrl(@Body() userDto: UserRequestDto, @Res() res: Response<UserResponseDto | ErrorResponse>) {
    try {
      const createdUser = this.userRepository.createUser(userDto);
      return res.status(HttpStatus.CREATED)
        .send(this.toDto(createdUser));

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST)
        .send(ErrorResponse.build(HttpStatus.BAD_REQUEST, error.message));
    }
  }

  private toDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      email: user.email
    }
  }
}