import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import UrlResponseDto from 'src/dto/urlResponse.dto';
import UrlRequestDto from '../dto/urlRequest.dto';
import { UrlRepository } from '../repository/url.repository';
import { UserRepository } from '../repository/user.repository';
import { KeyGeneratorService } from '../service/keyGenerator.service';

@Controller('/')
export class UrlController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly urlRepository: UrlRepository,
    private readonly keyGeneratorService: KeyGeneratorService
  ) { }

  @Get('/:urlHash')
  redirectToOriginalUrl(@Param() params: { urlHash: string }, @Res() res: Response) {
    if (params.urlHash) {
      const url = this.urlRepository.findByUrlHash(params.urlHash);

      if (url) {
        return res.redirect(url.originalUrl, HttpStatus.MOVED_PERMANENTLY);
      }
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('/url')
  @HttpCode(HttpStatus.OK)
  findAllShortUrls() {
    // TODO Find all for a specific user id
    return this.urlRepository.findAll();
  }

  @Post('/url/create')
  createUrl(@Body() urlRequestDto: UrlRequestDto, @Req() req: Request, @Res() res: Response<UrlResponseDto>) {
    if (true || this.userRepository.findUserById(urlRequestDto.userId)) { // TODO check header + user access
      const urlHash = this.keyGeneratorService.generate(urlRequestDto);
      const createdUrl = this.urlRepository.create(urlRequestDto, req.headers.host, urlHash);

      return res.status(HttpStatus.CREATED).send(createdUrl);
    }

    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
}
