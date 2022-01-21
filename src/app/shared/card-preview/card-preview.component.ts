import { Component, Input, OnInit } from '@angular/core'
import { PreviewDeck } from 'src/app/models/preview-deck'

import * as moment from 'moment'
import Swal from 'sweetalert2'
import { FlipmeService } from 'src/app/services/flipme.service'
import { AppComponent } from 'src/app/app.component'
import { GtagEvent } from 'src/app/models/gtag-event'

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewComponent implements OnInit {

  @Input() preview?: any
  @Input() edition: boolean = false
  @Input() removeElement: any

  today: string = moment().format()

  constructor(
    private flipMeService: FlipmeService,
    private app: AppComponent) { }

  ngOnInit(): void {
  }

  onDelete(id: number): void {

    console.log(id)

    Swal.fire({
      title: '¿Estas seguro que quieres eliminar la carta?',
      text: "¡Esta acción es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ¡eliminalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.flipMeService.removeCard(id)
          .subscribe((response: any) => {

            if (response.success) {

              this.removeElement(id)

              const gtagEvent: GtagEvent = {
                name_event: 'delete_card',
                params: {
                  event_category: 'Delete',
                  action: 'Delete',
                  event_label: `/user/cards/deck/${id}`
                }
              }
          
              this.app.setEventAnalytics(gtagEvent)

              Swal.fire(
                '¡Eliminado!',
                'La carta ha sido eliminada exitosamente.',
                'success'
              )
            }
          })
      }
    })
  }

}
