import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP_OK_STRING } from '../../url/constants';

export interface Response<T> {
  statusCode: number;
  message?: string,
  payload: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    return next.handle().pipe(map(data => ({
      statusCode: this.extractStatusCode(data),
      // message: extractMessage(data)
      payload: this.extractPayload(data)
    })));
  }

  private extractStatusCode(data) {
    if (data && data.statusCode)
        return data.statusCode;
    return 1;
  }

  private extractMessage(data): string {
    if (data && data.message)
      return data.message;
    return HTTP_OK_STRING;
  }

  private extractPayload(data): any {
    if (typeof (data) === 'object')
      return data;
    if (typeof (data) === 'string' || typeof (data) === 'boolean')
      // return { url: data };
      return data;
    return {};
  }
}
