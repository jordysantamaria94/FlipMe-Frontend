import { Component, OnInit } from '@angular/core'
import Swal from 'sweetalert2'
import { GtagEvent } from './models/gtag-event'

declare var gtag: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd'

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  tokenExpiredToast(): void {
    this.Toast.fire({
      icon: 'warning',
      title: "Tu sesión ha expirado, por seguridad, inicia sesión nuevamente"
    })
  }

  errorToast(title: string): void {
    this.Toast.fire({
      icon: 'error',
      title: title
    })
  }

  warningToast(title: string): void {
    this.Toast.fire({
      icon: 'warning',
      title: title
    })
  }

  successToast(title: string): void {
    this.Toast.fire({
      icon: 'success',
      title: title
    })
  }

  setEventAnalytics(gtagEvent: GtagEvent) {
    gtag('event', gtagEvent.name_event, gtagEvent.params)
  }
}
