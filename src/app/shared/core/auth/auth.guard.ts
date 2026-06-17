import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { from, map } from "rxjs";
import { Auth } from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    private readonly afAuth = inject(Auth);
    private readonly router = inject(Router);

    canActivate() {
        return from(this.afAuth.authStateReady()).pipe(
            map(() => {
                if (!this.afAuth.currentUser) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            })
        );
    }
}