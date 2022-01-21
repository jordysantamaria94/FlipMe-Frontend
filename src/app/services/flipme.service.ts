import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { JwtHelperService } from '@auth0/angular-jwt'
import { Sign } from '../models/sign'
import { NgForm } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class FlipmeService {

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  getQuery(query:string) {
    const url = `${environment.url}${ query }`

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("tkn")}`
    })

    return this.http.get(url, { headers })
  }

  postQuery(query:string, data: any) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("tkn")}`
    })

    const url = `${environment.url}${ query }`

    return this.http.post(url, data, { headers })
  }

  putQuery(query:string, data: any) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("tkn")}`
    })
    const url = `${environment.url}${ query }`

    return this.http.put(url, data, { headers })
  }

  deleteQuery(query:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("tkn")}`
    })

    const url = `${environment.url}${ query }`

    return this.http.delete(url, { headers })
  }

  isAuthenticated(): boolean {

    const token = localStorage.getItem('token')

    if (token !== undefined) {
      return !this.jwtHelper.isTokenExpired(token!)
    }
    
    return false
  }

  getAllDecks() {
    return this.getQuery(`home`)
  }

  getPreviewCards(idDeck: number) {
    return this.getQuery(`info/${idDeck}`)
  }

  getPlayDeck(idDeck: number) {
    return this.getQuery(`play/${idDeck}`)
  }

  signIn(loginForm: Sign) {
    return this.postQuery(`login`, loginForm)
  }

  signUp(loginForm: Sign) {
    return this.postQuery(`signup`, loginForm)
  }

  forgotPassword(form: any) {
    return this.postQuery('forgot-password', form)
  }

  updatePasswordForgot(form: any) {
    return this.postQuery('forgot-password/update', form)
  }

  /* USERS */

  getDashboard(id: number, page: number) {
    return this.getQuery(`dashboard/${id}?page=${page}`)
  }

  searchDeck(search: string) {
    return this.getQuery(`search/${search}`)
  }

  getUserInfo(id: number) {
    return this.getQuery(`user/configuration/${id}`)
  }

  updatePasswordUser(id: number, form: any) {
    return this.putQuery(`user/configuration/${id}`, form)
  }

  // DECKS

  createDeck(deckForm: any) {
    return this.postQuery('user/decks', deckForm)
  }

  updateDeck(deckForm: any, id: number) {
    return this.putQuery(`user/decks/${id}`, deckForm)
  }

  removeDeck(id: number) {
    return this.deleteQuery(`user/decks/${id}`)
  }

  getDeckInfo(idDeck: number) {
    return this.getQuery(`user/decks/${idDeck}`)
  }

  getDeckUpdate(idDeck: number) {
    return this.getQuery(`user/decks/${idDeck}/edit`)
  }

  // CARDS

  getCardsDeck(idDeck: number, page: number) {
    return this.getQuery(`user/cards/${idDeck}?page=${page}`)
  }

  createCard(cardForm: any) {
    return this.postQuery('user/cards', cardForm)
  }

  updateCard(deckForm: any, id: number) {
    return this.putQuery(`user/cards/${id}`, deckForm)
  }

  removeCard(id: number) {
    return this.deleteQuery(`user/cards/${id}`)
  }

  getCardInfo(idCard: number) {
    return this.getQuery(`user/cards/${idCard}/edit`)
  }

  // STATS
  
  getAllStatsDeck(idDeck: number, page: number) {
    return this.getQuery(`stats/all/${idDeck}?page=${page}`)
  }

  createStat(cardForm: any) {
    return this.postQuery('stats/create', cardForm)
  }
}
