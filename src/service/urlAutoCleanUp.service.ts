import { Injectable } from '@nestjs/common';
import { scheduleJob } from 'node-schedule';
import { UrlRepository } from 'src/repository/url.repository';

@Injectable()
export class UrlAutoCleanUp {
  constructor(private readonly urlRepository: UrlRepository) { }

  start(): void {
    scheduleJob('*/5 * * * *', (fireDate) => {
      const currentDate = new Date().getTime();
      const expiredUrls = this.urlRepository.findAll()
        .filter((url) => currentDate > parseInt(url.expirationDate));

      console.log(`Job is run at - ${fireDate}`);

      expiredUrls.forEach((url) => {
        this.urlRepository.delete(url.urlHash);
        console.log(`Delete url - ${url.urlHash}`);
      });
    });
  }
}
