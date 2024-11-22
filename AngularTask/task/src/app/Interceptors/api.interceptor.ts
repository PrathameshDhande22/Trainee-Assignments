import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_URL } from '../app.module';

// Used to add the base url to the url passed by the http client.
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseurl = inject(BASE_URL);
  const reqClone: HttpRequest<unknown> = req.clone({ url: baseurl + req.url });
  return next(reqClone);
};
