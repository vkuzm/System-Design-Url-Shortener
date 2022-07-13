import { Injectable } from '@nestjs/common';
import { verify as JwtVerify } from 'jsonwebtoken';

export default interface Token {
  userId: number;
}

const SECRET_KEY = 'secret';

@Injectable()
export class AuthTokenService {

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
