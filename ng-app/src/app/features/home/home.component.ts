import {AsyncPipe, NgIf} from "@angular/common"
import {Component} from "@angular/core"
import {Router} from "@angular/router"
import {HeaderComponent} from "../../components/header/header.component"
import {AuthService} from "../auth/auth.service"

@Component({
  imports: [HeaderComponent, AsyncPipe, NgIf],
  selector: "app-home",
  standalone: true,
  styleUrl: "./home.component.sass",
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  user$ = this.authService.loadUser()

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user$.subscribe({
      next: user => {
        if (!user) {
          this.navigateToLogin()
        }
      },
      error: () => {
        this.navigateToLogin()
      },
    })
  }

  logUserOut() {
    this.authService.logUserOut()
    this.navigateToLogin()
  }

  private navigateToLogin() {
    this.router.navigateByUrl("/login", {replaceUrl: true})
  }
}
