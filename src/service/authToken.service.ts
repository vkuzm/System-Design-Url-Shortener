import { Injectable } from '@nestjs/common';
import { verify as JwtVerify } from 'jsonwebtoken';
import { UrlRepository } from 'src/repository/url.repository';

export default interface Token {
  userId: number;
}

const SECRET_KEY = 'secret';

@Injectable()
export class AuthTokenService {
  constructor(private readonly urlRepository: UrlRepository) { }

  decodeToken(authorization: string): Promise<Token | any> {
    const token = authorization.replace(/^Bearer\s/, '');

    return new Promise((resolve, reject) => {
      JwtVerify(token, SECRET_KEY, function (error, decoded) {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
