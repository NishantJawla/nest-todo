import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';

// in Nest, almost everything is shared across incoming requests. We have a connection pool to the database, singleton services with global state, etc. Remember that Node.js doesn't follow the request/response Multi-Threaded Stateless Model in which every request is processed by a separate thread. Hence, using singleton instances is fully safe for our applications.

import type { Response } from 'express';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from './create-cat.dto';
import { CatsService } from './cats.service';
// Using a path prefix in a @Controller() decorator allows us to easily group a set of related routes, and minimize repetitive code.
@Controller('cats')
export class CatsController {
  // The CatsService is injected through the class constructor. Notice the use of the private syntax. This shorthand allows us to both declare and initialize the catsService member immediately in the same location.
  constructor(private catsService: CatsService) {}

  // Occasionally, you might have dependencies which do not necessarily have to be resolved. For instance, your class may depend on a configuration object, but if none is passed, the default values should be used. In such a case, the dependency becomes optional, because lack of the configuration provider wouldn't lead to errors.
  // constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
  // Note that in the example above we are using a custom provider, which is the reason we include the HTTP_OPTIONS custom token.

  //if your top-level class depends on either one or multiple providers, passing them all the way up by calling super() in sub-classes from the constructor can be very tedious. In order to avoid this, you can use the @Inject() decorator at the property level.
  // @Inject('HTTP_OPTIONS')
  // private readonly httpClient: T;
  // If your class doesn't extend another class, you should always prefer using constructor-based injection. The constructor explicitly outlines what dependencies are required and provides better visibility than class attributes annotated with @Inject.

  @Get()
  findAll(): string {
    // when a request handler returns a JavaScript object or array, it will automatically be serialized to JSON.
    // Nest will send just the value without attempting to serialize it. This makes response handling simple: just return the value, and Nest takes care of the rest.
    // this routes shouws the standard way to return a response by nest js which is recommended, if we want to return a response with different status code we can use the @HttpCode() decorator
    return `This action returns all cats ${JSON.stringify(this.catsService.findAll())}`;
  }

  @Get('re-routed-temproray')
  @HttpCode(302)
  reRouted(): string {
    // this routes shows how to return a response with a different status code and the standard way recommended by nest js
    return 'This action returns a re-routed cat';
  }

  //   library specific way of routing
  // The main disadvantage is that your code becomes platform-dependent (as underlying libraries may have different APIs on the response object), and harder to test (you'll have to mock the response object, etc.).
  // Also, in the example above, you lose compatibility with Nest features that depend on Nest standard response handling, such as Interceptors and @HttpCode() / @Header() decorators. To fix this, you can set the passthrough option to true, as follows:
  @Get('library-specific-way')
  librarySpecificWay(
    @Res({ passthrough: true }) response: Response,
  ): Response<any, Record<string, any>> {
    return response
      .status(200)
      .send('This action returns a cat via the library specific way');
  }

  // Default http code used by nest in post endpoint is 201
  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<string> {
    console.log(
      `We are creating a cat with the data ${JSON.stringify(createCatDto)}`,
    );
    this.catsService.create(createCatDto);
    return `This action adds a new cat with the data ${JSON.stringify(createCatDto)}`;
  }

  // wildcard route
  @Get('wild*')
  wild(): string {
    return 'This is a wild route';
  }

  // standard way of setting header
  @Get('header-response')
  @Header('Custom-Header', 'standard-way-of-setting-header')
  headerResponse(): string {
    return 'This action returns a response with a custom header';
  }

  // library specific way of setting header
  @Get('header-response-library-specific-way')
  headerResponseLibrarySpecificWay(@Res() response: Response): Response {
    return response
      .header('Custom-Header', 'library-specific-way-of-setting-header')
      .send(
        'This action returns a response with a custom library specific header',
      );
  }

  // standard way of redirecting
  @Get('redirect-standard-way')
  @Redirect('https://nestjs.com', 301)
  redirect(): string {
    return 'This action redirects to the NestJS website';
  }

  // library specific way of redirecting
  @Get('redirect-library-specific-way')
  redirectLibrarySpecificWay(@Res() response: Response): void {
    response.redirect(301, 'https://nestjs.com');
  }

  // Redirecting with query parameters override the default behavior of the @Redirect() decorator
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  // Have to read more about the observable streams https://rxjs-dev.firebaseapp.com/guide/observable
  @Get()
  findAllObservableStreams(): Observable<any[]> {
    return of([]);
  }

  @Get('http-exception')
  httpException(): void {
    // Out of the box, this action is performed by a built-in global exception filter, which handles exceptions of type HttpException (and subclasses of it). When an exception is unrecognized (is neither HttpException nor a class that inherits from HttpException), the built-in exception filter generates the following default JSON response:
    //   {
    //     "message": "Something bad happened",
    //     "error": "Some error description",
    //     "statusCode": 400
    // } this response is returned via the bad request exception
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
    throw new HttpException('You have encountered an HttpException', 503);
  }

  // If you declare the route above the below route above http-exception route then that becomes inaccessible
  @Get(':id')
  fidOne(@Param('id') id: string): string {
    return `This action returns a #${id} cat`;
  }
}
