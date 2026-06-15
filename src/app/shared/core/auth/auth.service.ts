import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth'


@Injectable({ providedIn: 'root' })
export class AuthService {

  
    user$: Observable<User | null>;


  constructor(private readonly afAuth: Auth) {
    this.user$ = user(this.afAuth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  logout() {
    return signOut(this.afAuth);
  }
}
