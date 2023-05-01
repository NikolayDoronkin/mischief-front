import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type'                : 'application/json; charset=utf-8',
        'Accept'                      : 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Authorization'               : `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    return next.handle(req);
  }
}
