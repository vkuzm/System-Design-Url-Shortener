import { Injectable } from '@nestjs/common';
import base64url from "base64url";
import { UrlRepository } from 'src/repository/url.repository';
import UrlRequestDto from '../dto/urlRequest.dto';

@Injectable()
export class KeyGeneratorService {
  constructor(private readonly urlRepository: UrlRepository) { }

  generate(urlRequestDto: UrlRequestDto): string {
    let urlHash = this.generateUrlHash(urlRequestDto);

    while (this.urlRepository.isUrlHashExsited(urlHash)) {
      urlHash = this.generateUrlHash(urlRequestDto);
    }
    return urlHash;
  }

  private generateUrlHash(urlRequestDto: UrlRequestDto) {
    const encodedOriginalUrl = base64url.encode(urlRequestDto.userId + urlRequestDto.url + new Date().getTime());
    return encodedOriginalUrl.slice(encodedOriginalUrl.length - 7, encodedOriginalUrl.length);
  }
}
