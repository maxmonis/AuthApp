import {Component} from "@angular/core"
import {RouterOutlet} from "@angular/router"
import {ThemeService} from "./services/theme.service"

@Component({
  imports: [RouterOutlet],
  selector: "app-root",
  standalone: true,
  styleUrl: "./app.component.sass",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  dark = this.themeService.dark
  year = new Date().getFullYear()

  constructor(private themeService: ThemeService) {}

  toggleDark(dark = !this.dark) {
    this.dark = dark
    this.themeService.setDark(dark)
  }
}
