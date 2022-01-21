import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import decode from 'jwt-decode'
import { FlipmeService } from './flipme.service'

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public logged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public loggedStream$ = this.logged.asObservable()

  constructor(public auth: FlipmeService) { }

  public broadcastLoggedStream(logged: boolean) {
    this.logged.next(logged)
  }

  public getIdUser(): number {

    const token = localStorage.getItem('token')

    if (token) {

      const tokenPayload: any = decode(token!)

      if (this.auth.isAuthenticated()) {
        return tokenPayload.id
      }
    }

    return 0
  }

  public getNameUser(): string {

    const token = localStorage.getItem('token')

    if (token) {

      const tokenPayload: any = decode(token!)

      if (this.auth.isAuthenticated()) {
        return tokenPayload.name
      }
    }

    return ""
  }
}
