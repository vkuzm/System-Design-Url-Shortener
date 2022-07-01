import { Module } from '@nestjs/common';
import { UrlController } from './controller/url.controller';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';
import { UrlRepository } from './repository/url.repository';
import { KeyGeneratorService } from './service/keyGenerator.service';

@Module({
  imports: [],
  controllers: [UrlController, UserController],
  providers: [UserRepository, UrlRepository, KeyGeneratorService],
})
export class AppModule { }
