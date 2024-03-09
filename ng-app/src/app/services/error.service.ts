import {HttpErrorResponse} from "@angular/common/http"
import {Injectable} from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  getErrorText(error: unknown) {
    let message = "An unexpected error occurred"
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof Error && error.error.message) {
        message = error.error.message
      } else if (typeof error.error === "string" && error.error) {
        message = error.error
      } else if (error.message) {
        message = error.message
      }
      return [error.status, message].join(": ")
    }
    if (error instanceof Error && error.message) {
      message = error.message
    } else if (typeof error === "string" && error) {
      message = error
    }
    return message
  }
}
