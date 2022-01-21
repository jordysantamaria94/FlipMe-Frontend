import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router } from '@angular/router'
import decode from 'jwt-decode'
import { FlipmeService } from '../services/flipme.service'

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(public auth: FlipmeService, public router: Router) { }

  canActivate (route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole
    const token = localStorage.getItem('token')

    if (token) {

      const tokenPayload: any = decode(token!)

      if (!this.auth.isAuthenticated() || tokenPayload.id_role !== expectedRole) {
        this.router.navigate(['/signin'])
        return false
      }
      return true
    }

    this.router.navigate(['/signin'])
    return false
  }
}
