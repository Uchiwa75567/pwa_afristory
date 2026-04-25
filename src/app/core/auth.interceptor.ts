import { HttpInterceptorFn } from '@angular/common/http';

const tokenStorageKey = 'afristory.session.token.v2';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const token =
    typeof window === 'undefined' ? null : window.localStorage.getItem(tokenStorageKey);

  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
