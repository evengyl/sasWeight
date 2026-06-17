import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    private readonly auth: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);

    constructor() { }

    canActivate() {
        return this.auth.user$.pipe(
            map(user => {
                if (user) return true;
                this.router.navigate(['/login']);
                return false;
            })
        );
    }
}
