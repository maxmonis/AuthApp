import {Component} from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {ActivatedRoute, Router, RouterLink} from "@angular/router"
import {ButtonComponent} from "../../components/button/button.component"
import {HeaderComponent} from "../../components/header/header.component"
import {ErrorService} from "../../services/error.service"
import {AuthService} from "./auth.service"
import {AuthRoute} from "./auth.types"

@Component({
  imports: [HeaderComponent, ButtonComponent, ReactiveFormsModule, RouterLink],
  selector: "app-auth",
  standalone: true,
  styleUrl: "./auth.component.sass",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {
  authenticating = true
  authForm!: FormGroup
  buttonText = ""
  emailSent = false
  error = ""
  path!: AuthRoute
  showValidation = false
  submitting = false
  title = ""

  private token = ""

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.redirectIfLoggedIn()
    this.getRouteInfo()
    this.title = this.getTitle()
    this.buttonText = this.getButtonText()
    this.authForm = this.createAuthForm()
  }

  private redirectIfLoggedIn() {
    this.authService.loadUser().subscribe(user => {
      if (user) {
        this.router.navigateByUrl("/", {replaceUrl: true})
      } else {
        this.authenticating = false
      }
    })
  }

  private getRouteInfo() {
    this.route.url.subscribe(url => {
      this.path = url[0].path as AuthRoute
    })
    this.route.params.subscribe(params => {
      this.token = params["token"]
    })
  }

  private getTitle() {
    switch (this.path) {
      case "login": {
        return "Access Account"
      }
      case "register": {
        return "Create Account"
      }
      case "forgot-password": {
        return "Forgot Password"
      }
      case "update-password": {
        return "Change Password"
      }
    }
  }

  private getButtonText() {
    switch (this.path) {
      case "login": {
        return "Log In"
      }
      case "register":
      case "forgot-password": {
        return "Send Link"
      }
      case "update-password": {
        return "Save New Password"
      }
    }
  }

  private createAuthForm() {
    const email = new FormControl("", [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
    ])
    const password = new FormControl("", [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ])
    const password2 = new FormControl("", [Validators.required])
    const controls: {
      email?: typeof email
      password?: typeof password
      password2?: typeof password2
    } = {}
    if (["login", "register", "forgot-password"].includes(this.path)) {
      controls.email = email
    }
    if (["login", "register", "update-password"].includes(this.path)) {
      controls.password = password
    }
    if (["register", "update-password"].includes(this.path)) {
      controls.password2 = password2
    }
    return new FormGroup(controls)
  }

  get email() {
    return this.authForm.get("email")
  }
  get password() {
    return this.authForm.get("password")
  }
  get password2() {
    return this.authForm.get("password2")
  }

  handleSubmit() {
    this.showValidation = true
    const password = this.password?.value
    if (this.password2?.valid && this.password2.value !== password) {
      this.password2.setErrors(["mismatch"])
    }
    if (this.submitting || this.authForm.invalid) {
      return
    }
    this.submitting = true
    const email = this.email?.value
    switch (this.path) {
      case "login": {
        this.authService.logUserIn({email, password}).subscribe({
          error: error => {
            this.handleError(error)
          },
        })
        break
      }
      case "register": {
        this.authService.sendActivationEmail({email, password}).subscribe({
          next: () => {
            this.emailSent = true
          },
          error: error => {
            this.handleError(error)
          },
        })
        break
      }
      case "forgot-password": {
        this.authService.sendPasswordResetEmail({email}).subscribe({
          next: () => {
            this.emailSent = true
          },
          error: error => {
            this.handleError(error)
          },
        })
        break
      }
      case "update-password": {
        const {token} = this
        this.authService.updatePassword({password, token}).subscribe({
          error: error => {
            this.handleError(error)
          },
        })
      }
    }
  }

  private handleError(error: unknown) {
    this.error = this.errorService.getErrorText(error)
    setTimeout(() => {
      this.error = ""
      this.submitting = false
    }, 3000)
  }

  hideValidation() {
    this.showValidation = false
  }

  isAlphanumeric(password: string) {
    return /^[A-Za-z\d]+$/.test(password)
  }
}
