import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckInfoComponent } from './components/deck-info/deck-info.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PlayDeckComponent } from './components/play-deck/play-deck.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './auth/role-guard.service';
import { AddDeckComponent } from './components/user/decks/add-deck/add-deck.component';
import { UpdateDeckComponent } from './components/user/decks/update-deck/update-deck.component';
import { GeneralCardsComponent } from './components/user/cards/general-cards/general-cards.component';
import { AddCardComponent } from './components/user/cards/add-card/add-card.component';
import { UpdateCardComponent } from './components/user/cards/update-card/update-card.component';
import { StatsDeckComponent } from './components/user/decks/stats-deck/stats-deck.component';
import { PrivacyPolicyComponent } from './components/terms/privacy-policy/privacy-policy.component';
import { TermsUseComponent } from './components/terms/terms-use/terms-use.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SearchComponent } from './components/search/search.component';
import { ConfigurationComponent } from './components/user/configuration/configuration.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'deck/:id/:name', component: DeckInfoComponent },
  { path: 'play/:id', component: PlayDeckComponent },
  { path: 'search/:search', component: SearchComponent },
  { path: 'politica-privacidad', component: PrivacyPolicyComponent },
  { path: 'condiciones-servicio', component: TermsUseComponent },
  { 
    path: 'signin', 
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'signup', 
    component: SignupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  // USER
  {
    path: 'user/dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'user/deck/add',
    component: AddDeckComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'user/deck/update/:deck',
    component: UpdateDeckComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    },
  },
  {
    path: 'user/deck/stats/:deck',
    component: StatsDeckComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    },
  },
  {
    path: 'user/cards/deck/:deck',
    component: GeneralCardsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'user/card/add/:deck',
    component: AddCardComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'user/card/update/:card',
    component: UpdateCardComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  {
    path: 'user/configuration',
    component: ConfigurationComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 2
    }
  },
  // Restrictions
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
