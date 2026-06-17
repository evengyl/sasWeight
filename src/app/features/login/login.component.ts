import { Component, effect, inject, Signal } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/core/auth/auth.service";
import { PrimeExportModule } from "../../shared/primeModuleExport.module";
import { SharedExportModule } from "../../shared/sharedExport.module";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    imports: [PrimeExportModule, SharedExportModule],
})
export class LoginComponent {

    private readonly auth = inject(AuthService);
    private readonly router = inject(Router)
    private readonly fb = inject(FormBuilder);

    form: FormGroup;
    error: string | null = null;
    loading = false;

    authState : Signal<boolean> = this.auth.state_S;

    constructor() {
        this.form = this.fb.group({
            email: ['infi@arbredejade.be', [Validators.required, Validators.email]],
            password: ['InfiJade__', Validators.required]
        });

        effect(() => {
            if(this.authState()) {
                this.router.navigate(['/']);
            }
        })
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