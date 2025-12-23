import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class SetAuthTokenInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.accessToken) {
      this.authService.setAccessToken(request.accessToken);
    }

    return next.handle();
  }
}
