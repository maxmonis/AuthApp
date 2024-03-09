import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http"
import {ApplicationConfig} from "@angular/core"
import {provideRouter, withViewTransitions} from "@angular/router"
import {routes} from "./app.routes"
import {authInterceptor} from "./features/auth/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withViewTransitions()),
  ],
}
