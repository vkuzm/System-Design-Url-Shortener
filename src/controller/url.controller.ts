import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import UrlResponseDto from 'src/dto/urlResponse.dto';
import { AuthTokenService } from 'src/service/authToken.service';
import { UrlAutoCleanUp } from 'src/service/urlAutoCleanUp.service';
import UrlRequestDto from '../dto/urlRequest.dto';
import { UrlRepository } from '../repository/url.repository';
import { UserRepository } from '../repository/user.repository';
import { KeyGeneratorService } from '../service/keyGenerator.service';

@Controller()
export class UrlController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly urlRepository: UrlRepository,
    private readonly keyGeneratorService: KeyGeneratorService,
    private readonly authTokenService: AuthTokenService,
    private readonly urlAutoCleanUp: UrlAutoCleanUp
  ) { }

  @Get('/:urlHash')
  redirectToOriginalUrl(@Param() params: { urlHash: string }, @Res() res: Response) {
    if (params.urlHash) {
      const url = this.urlRepository.findByUrlHash(params.urlHash);

      if (url) {
        const currentDate = new Date().getTime();
        const expirationDate = parseInt(url.expirationDate);

        if (currentDate > expirationDate) {
          console.log(`Hash URL ${params.urlHash} is already expired`);

          this.urlRepository.delete(params.urlHash);
          return res.status(HttpStatus.NOT_FOUND).send();
        }

        return res.redirect(HttpStatus.MOVED_PERMANENTLY, url.originalUrl);
      }
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('/url/list')
  @HttpCode(HttpStatus.OK)
  async findAllShortUrls(@Req() req: Request, @Res() res: Response) {
    if (!req.headers.authorization) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }

    const { userId } = await this.authTokenService.decodeToken(req.headers.authorization);

    const urls = this.urlRepository.findAllByUserId(parseInt(userId));
    return res.status(HttpStatus.OK).send(urls);
  }

  @Post('/url/create')
  async createUrl(@Body() urlRequestDto: UrlRequestDto, @Req() req: Request, @Res() res: Response<UrlResponseDto>) {
    if (!req.headers.authorization) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }

    const { userId } = await this.authTokenService.decodeToken(req.headers.authorization);
    if (this.userRepository.findUserById(userId)) {
      const urlHash = this.keyGeneratorService.generate(urlRequestDto);
      const createdUrl = this.urlRepository.create(urlRequestDto, req.headers.host, urlHash);
      this.urlAutoCleanUp.start();

      return res.status(HttpStatus.CREATED).send(createdUrl);
    }

    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
}
