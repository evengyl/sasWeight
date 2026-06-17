import { Component, inject } from '@angular/core';
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

  state : boolean = false;

  constructor() { 
    this.auth.user$.subscribe((user) => {
      if (user) this.state = true;
      else this.state = false;
    })
  }

  logout(){
    this.auth.logout();
  }
}
