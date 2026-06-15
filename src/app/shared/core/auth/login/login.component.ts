import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    standalone: false,
})
export class LoginComponent {

    form: FormGroup;
    error: string | null = null;
    loading = false;

    isUserConnected = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly router: Router
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });


        this.auth.user$.subscribe(user => {
            if (user)
                this.isUserConnected = true;
            else this.isUserConnected = false;
        });
    }

    async submit() {
        if (this.form.invalid) return;

        this.loading = true;
        this.error = null;

        const { email, password } = this.form.value;

        try {
            await this.auth.login(email, password);

            // Redirection après login
            this.router.navigate(['/']);
        } catch (err: any) {
            this.error = this.mapError(err.code);
        } finally {
            this.loading = false;
        }
    }

    
    async logout() {

        await this.auth.logout();
        this.router.navigate(['/login']);
    }


    private mapError(code: string): string {
        switch (code) {
            case 'auth/user-not-found':
                return 'Utilisateur inconnu';
            case 'auth/wrong-password':
                return 'Mot de passe incorrect';
            default:
                return 'Erreur de connexion';
        }
    }

}