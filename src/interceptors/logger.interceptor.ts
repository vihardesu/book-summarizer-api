import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SummaryLog } from './log-types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Interceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const request_cleaned = {
      user_agent: `${request['headers']['user-agent']}`,
      host: `${request['host']}`,
      request_body: `${JSON.stringify(request['body'])}`,
      route_path: `${request['route']['path']}`,
      start_timestamp: `${Date.now()}`,
    };

    return next.handle().pipe(
      tap((data) => {
        const log: SummaryLog = {
          ...request_cleaned,
          response_body: data,
          end_timestamp: `${Date.now()}`,
        };

        this.logger.log(JSON.stringify(log));
      }),
    );
  }
}
