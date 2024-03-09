export class StorageService<
  K extends "dark" | "token",
  T extends K extends "dark" ? boolean : string,
> {
  private key: string

  constructor(key: K) {
    this.key = "AuthApp_" + key
  }

  get(): T | null {
    const item = localStorage.getItem(this.key)
    return item ? JSON.parse(item) : null
  }

  set(item: T) {
    return localStorage.setItem(this.key, JSON.stringify(item))
  }

  remove() {
    return localStorage.removeItem(this.key)
  }
}

export const localDark = new StorageService("dark")
export const localToken = new StorageService("token")
