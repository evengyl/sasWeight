import { Component, effect, inject, Signal } from '@angular/core';
import { PrimeExportModule } from '../../shared/primeModuleExport.module';
import { SharedExportModule } from '../../shared/sharedExport.module';
import { AuthService } from '../../shared/core/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [PrimeExportModule, SharedExportModule]
})
export class FooterComponent {
  private readonly auth: AuthService = inject(AuthService);

  authState : Signal<boolean> = this.auth.state_S;

  constructor() {
  }

  logout(){
    this.auth.logout();
  }
}
