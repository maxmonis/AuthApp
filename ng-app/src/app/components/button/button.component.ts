import {Component, Input} from "@angular/core"

@Component({
  selector: "app-button",
  standalone: true,
  styleUrl: "./button.component.sass",
  templateUrl: "./button.component.html",
})
export class ButtonComponent {
  @Input() disabled = false
  @Input() loading = false
  @Input({required: true}) text!: string
  @Input() type: "button" | "reset" | "submit" = "button"
}
