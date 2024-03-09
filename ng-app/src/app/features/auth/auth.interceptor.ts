import {HttpHandlerFn, HttpRequest} from "@angular/common/http"
import {inject} from "@angular/core"
import {AuthService} from "./auth.service"

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const token = inject(AuthService).token
  return next(
    req.clone(
      token
        ? {headers: req.headers.append("X-Auth-Token", token)}
        : {headers: req.headers.delete("X-Auth-Token")},
    ),
  )
}
