import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { error } from 'console';
import { LoggingInterceptor } from './interceptors/logger.interceptor';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    try {
      return this.appService.getHello();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }

  @Get('google_books_query/:query')
  getBookMetadataFromGoogle(@Param('query') query: string): any {
    try {
      return this.appService.getBookMetadataFromGoogle(query);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
  }

  @Post('embedly')
  async embedly(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.embedly(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Embedly could not extract text from url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('tinq')
  async tinq(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.tinq(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Tinq could not extract text from url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('tinq_title')
  async tinq_title(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.tinq_title(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Tinq could not get title from url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('youtube_to_text')
  async youtube_to_text(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.youtube_to_text(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Youtube transcript could not extract text from url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('youtube_title')
  async youtube_title(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.youtube_title(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Youtube title could not be extracted for url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('openai_single')
  async openai_single(@Body() body): Promise<string> {
    try {
      const short_text = body.short_text;
      return await this.appService.openai_single(short_text);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Openai could not summarize text: ${body.short_text} because ${error}`,
      });
    }
  }

  @ApiBody({ description: "body:any someMethod" })
  @Post('openai_single_chunks')
  async openai_parallel_single_with_concatenation(@Body() body): Promise<string> {
    try {
      const chunks = body.chunks;
      return await this.appService.openai_parallel_single_with_concatenation(chunks);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Openai could not summarize text because ${error}`,
      });
    }
  }

  @Post('openai_multiple')
  async openai_multiple(@Body() body): Promise<string> {
    try {
      const long_text = body.long_text;
      return await this.appService.openai_multiple(long_text);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Openai could not summarize text: ${body.long_text} because ${error}`,
      });
    }
  }

  @Post('summary')
  async summary(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.summarize_article(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Could not summarize url: ${body.url} because ${error}`,
      });
    }
  }

  @Post('openai_single_bullet_points')
  async openai_single_bullet_points(@Body() body): Promise<string> {
    try {
      const short_text = body.short_text;
      return await this.appService.openai_single_bullets(short_text);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Openai could not summarize text: ${body.short_text} because ${error}`,
      });
    }
  }

  @Post('openai_multiple_bullet_points')
  async openai_multiple_bullet_points(@Body() body): Promise<string> {
    try {
      const long_text = body.long_text;
      return await this.appService.openai_multiple_bullet_points(long_text);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Openai could not summarize text: ${body.long_text} because ${error}`,
      });
    }
  }

  @Post('summary_bullet_points')
  async summary_bullet_points(@Body() body): Promise<string> {
    try {
      const url = body.url;
      return await this.appService.bullet_points_article(url);
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: `Could not get bullet points for url: ${body.url} because ${error}`,
      });
    }
  }
}
