import { Injectable } from '@nestjs/common';
import UrlRequestDto from 'src/dto/urlRequest.dto';
import Url from 'src/model/url.model';

@Injectable()
export class UrlRepository {
  private readonly database = new Map<string, Url>();

  findAll(): Url[] {
    return Array.from(this.database.values());
  }

  findAllByUserId(userId: number): Url[] {
    return Array.from(this.database.values())
      .filter((url) => url.userId === userId);
  }

  findByUrlHash(urlHash: string): Url {
    return this.database.get(urlHash);
  }

  isUrlHashExsited(urlHash: string): boolean {
    return !!this.findByUrlHash(urlHash);
  }

  create(urlRequestDto: UrlRequestDto, host: string, urlHash: string): Url {
    if (this.database.has(urlHash)) {
      throw new Error(`Short URL ${host}/${urlHash} already exists`);

    } else {
      this.database.set(urlHash, {
        urlHash: urlHash,
        shortUrl: `${host}/${urlHash}`,
        originalUrl: urlRequestDto.url,
        expirationDate: urlRequestDto.expirationDate,
        userId: urlRequestDto.userId
      });

      return this.database.get(urlHash);
    }
  }

  delete(urlHash: string): void {
    this.database.delete(urlHash);
  }
}
