import { Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { FlipmeService } from '../services/flipme.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: FlipmeService, public router: Router, private injector: Injector) { }

  canActivate(): boolean {
    
    const injector = this.injector.get(FlipmeService)

    if (!injector.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(['user/dashboard'])
      return false
    }
  }
}
