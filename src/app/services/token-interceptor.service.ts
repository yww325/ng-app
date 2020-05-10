import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from './token.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private readonly tokenService: TokenService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        const token = this.tokenService.getToken();  
        request = request.clone({ 
            setHeaders: {
                'userPass': token
            }
        }); 
        return next.handle(request).pipe(
            catchError(handleError)
        );
    } 
}
   
export function handleError(error: HttpErrorResponse) {
    console.log(error.message); 
    return throwError(error);
}
