import {AsyncPipe} from "@angular/common"
import {Component} from "@angular/core"
import {ActivatedRoute, RouterLink} from "@angular/router"
import {AuthService} from "../auth.service"

@Component({
  imports: [AsyncPipe, RouterLink],
  selector: "app-activate",
  standalone: true,
  styleUrl: "../auth.component.sass",
  templateUrl: "./activate.component.html",
})
export class ActivateComponent {
  error = false
  user$ = this.authService.loadUser()

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activateAccount()
  }

  private activateAccount() {
    this.route.params.subscribe(params => {
      this.authService.activateAccount(params["token"]).subscribe({
        error: () => {
          this.error = true
        },
      })
    })
  }

  handleLogout() {
    this.authService.logUserOut()
  }
}
