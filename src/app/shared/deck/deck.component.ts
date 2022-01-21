import { Component, Input, OnInit } from '@angular/core'
import { Decks } from 'src/app/models/decks'
import { FlipmeService } from 'src/app/services/flipme.service'
import { environment } from 'src/environments/environment'

import * as moment from 'moment'
import Swal from 'sweetalert2'
import { AppComponent } from 'src/app/app.component'
import { GtagEvent } from 'src/app/models/gtag-event'

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  @Input() redirect?: string
  @Input() deck: Decks = new Decks()
  @Input() edition: boolean = false
  @Input() getMyDecks: any

  today: string = moment().format()

  urlServer: string = environment.url

  constructor(
    private flipMeService: FlipmeService,
    private app: AppComponent) { }

  ngOnInit(): void {
  }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estas seguro que quieres eliminar la baraja?',
      text: "¡Esta acción es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ¡eliminalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.flipMeService.removeDeck(id)
          .subscribe((response: any) => {

            if (response.success) {
              Swal.fire(
                '¡Eliminado!',
                'La baraja ha sido eliminada exitosamente.',
                'success'
              )

              const gtagEvent: GtagEvent = {
                name_event: 'delete_deck',
                params: {
                  event_category: 'Delete',
                  action: 'Delete',
                  event_label: '/user/dashboard'
                }
              }

              this.app.setEventAnalytics(gtagEvent)

              this.getMyDecks()
            }
          })
      }
    })
  }

  copyLink(deck: Decks): void {

    const gtagEvent: GtagEvent = {
      name_event: 'shared_deck',
      params: {
        event_category: 'Shared',
        action: 'Shared',
        event_label: `${environment.urlFront}deck/${deck.id}`
      }
    }

    this.app.setEventAnalytics(gtagEvent)

    var input = document.body.appendChild(document.createElement("input"))
    input.value = `${environment.urlFront}deck/${deck.id}/${this.convertNameToUrl(deck.name!)}`
    input.focus()
    input.select()
    document.execCommand('copy')
    input.parentNode?.removeChild(input)

    this.app.successToast("Enlace copiado exitosamente")
  }

  convertNameToUrl = (name: string): string => name?.replace(" ", "-").toLowerCase()
}
