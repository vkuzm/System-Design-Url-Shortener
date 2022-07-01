import { Module } from '@nestjs/common';
import { UrlController } from './controller/url.controller';
import { UserController } from './controller/user.controller';
import { UrlRepository } from './repository/url.repository';
import { UserRepository } from './repository/user.repository';
import { AuthTokenService } from './service/authToken.service';
import { KeyGeneratorService } from './service/keyGenerator.service';
import { UrlAutoCleanUp } from './service/urlAutoCleanUp.service';

@Module({
  imports: [],
  controllers: [UrlController, UserController],
  providers: [UserRepository, UrlRepository, KeyGeneratorService, AuthTokenService, UrlAutoCleanUp],
})
export class AppModule { }
