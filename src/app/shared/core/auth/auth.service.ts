import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth'
import { Router } from "@angular/router";


@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<User | null>;

  private readonly afAuth: Auth = inject(Auth);
  private readonly router = inject(Router); 
  
  constructor() {
    this.user$ = user(this.afAuth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  logout() {
    signOut(this.afAuth);
    this.router.navigate(['/login']);
  }
}
