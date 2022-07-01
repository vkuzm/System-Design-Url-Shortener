import { OmitType } from '@nestjs/swagger';
import User from 'src/model/user.model';

export default class UserResponseDto extends OmitType(User, ['password'] as const) { }