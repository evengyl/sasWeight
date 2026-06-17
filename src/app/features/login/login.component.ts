import { Component, effect, inject, Signal } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/core/auth/auth.service";
import { PrimeExportModule } from "../../shared/primeModuleExport.module";
import { SharedExportModule } from "../../shared/sharedExport.module";
import { environment } from "../../../environments/environment";

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
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        //si developpement, auto login
        if(environment.production === false)
        {
            this.form.setValue({
                email : environment.loginEmail,
                password: environment.loginPassword
            });
        }

        effect(() => {
            if(this.authState()) {
                this.router.navigate(['/']);
            }
        })
    }


    async submit() {
        if (this.form.invalid) return;

        this.loading = true;
        const { email, password } = this.form.value;
        this.auth.login(email, password);
        this.loading = false;
    }

    
    logout()
    {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}