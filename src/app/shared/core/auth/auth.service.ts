import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, user, User} from '@angular/fire/auth'
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import {toSignal} from '@angular/core/rxjs-interop';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly user_S: Signal<User | null> = signal(null);
  readonly state_S = computed(() => Boolean(this.user_S()?.uid));


  private readonly afAuth: Auth = inject(Auth);
  private readonly router = inject(Router); 
  private readonly messageService = inject(MessageService);


  constructor() {
    this.user_S = toSignal(user(this.afAuth))
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.afAuth, email, password).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Connexion réussie' });
    })
    .catch(() => {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la connexion' });
    })
  }

  logout() {
    signOut(this.afAuth).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Déconnexion réussie' });
    })

    this.router.navigate(['/login']);
  }
}
