import {Injectable} from "@angular/core"
import {localDark} from "./storage.service"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  dark = localDark.get() ?? matchMedia("(prefers-color-scheme: dark)").matches

  constructor() {
    this.setDark(this.dark)
  }

  setDark(dark: boolean) {
    this.dark = dark
    localDark.set(dark)
    if (dark) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }
}
