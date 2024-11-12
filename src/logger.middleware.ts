import { NestMiddleware, Injectable } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

// The class should implement the NestMiddleware interface, while the function does not have any special requirements. Let's start by implementing a simple middleware feature using the class method.
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request received with url ${req.url} from ${req.ip}`);
    next();
    console.log(`Response sent with status ${res.statusCode}`);
  }
}

// This is an example how we can create a functional middleware
// export function logger(req: Request, res: Response, next: NextFunction) {
//     console.log(`Request...`);
//     next();
//   };
