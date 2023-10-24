import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private readonly API_KEY = 'b887fa32a795d9949334a48e6698785e'
  private readonly API_HOST = 'v3.football.api-sports.io'
  private readonly CUSTOM_HEADERS = new HttpHeaders({
    'x-rapidapi-key': this.API_KEY,
    'x-rapidapi-host': this.API_HOST,
  })

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ headers: this.CUSTOM_HEADERS })
    return next.handle(req)
  }
}
