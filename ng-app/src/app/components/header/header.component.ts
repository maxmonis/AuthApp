import {TitleCasePipe} from "@angular/common"
import {Component} from "@angular/core"
import {RouterLink, RouterLinkActive} from "@angular/router"

@Component({
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  selector: "app-header",
  standalone: true,
  styleUrl: "./header.component.sass",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {}
