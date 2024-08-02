import {HttpClient} from "@angular/common/http"
import {Injectable} from "@angular/core"
import {Router} from "@angular/router"
import {Observable, of, share} from "rxjs"
import {localToken} from "../../services/storage.service"
import {TokenRes, UserRes} from "./auth.types"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  token = localToken.get()

  private user: UserRes | null = null
  private user$?: Observable<UserRes | null>

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  activateAccount(token: string) {
    const observable = this.http
      .post<TokenRes>("/api/user/activate", {token})
      .pipe(share())
    observable.subscribe(({token}) => {
      this.handleTokenRes(token)
    })
    return observable
  }

  private handleTokenRes(token: typeof this.token) {
    this.setToken(token)
    this.navigateToHome()
  }

  loadUser() {
    if (!this.token) {
      this.logUserOut()
    } else if (!this.user$) {
      this.user$ = this.http.get<UserRes>("/api/user").pipe(share())
      this.user$.subscribe({
        next: user => {
          this.user = user
          this.refreshToken()
        },
        error: () => {
          this.logUserOut()
        },
      })
    }
    return this.user ? of(this.user) : this.user$ ?? of(null)
  }

  logUserIn(payload: {email: string; password: string}) {
    const observable = this.http
      .post<TokenRes>("/api/user/login", payload)
      .pipe(share())
    observable.subscribe(({token}) => {
      this.handleTokenRes(token)
    })
    return observable
  }

  logUserOut() {
    this.setToken(null)
    this.user = null
    delete this.user$
  }

  private navigateToHome() {
    this.loadUser().subscribe(user => {
      if (user) {
        this.router.navigateByUrl("/", {replaceUrl: true})
      }
    })
  }

  refreshToken() {
    if (this.token) {
      this.http.get<TokenRes>("/api/user/refresh").subscribe({
        next: ({token}) => {
          this.setToken(token)
        },
        error: () => {
          this.logUserOut()
        },
      })
    }
  }

  setToken(token: typeof this.token) {
    token ? localToken.set(token) : localToken.remove()
    this.token = token
  }

  sendActivationEmail(payload: {email: string; password: string}) {
    return this.http.post<string>("api/user/register", payload)
  }

  sendPasswordResetEmail(payload: {email: string}) {
    return this.http.post<string>("/api/user/forgot-password", payload)
  }

  updatePassword(payload: {password: string; token: string}) {
    const observable = this.http
      .patch<TokenRes>("/api/user/update-password", payload)
      .pipe(share())
    observable.subscribe(({token}) => {
      this.handleTokenRes(token)
    })
    return observable
  }
}
