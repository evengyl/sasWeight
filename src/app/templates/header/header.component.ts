import { Component } from '@angular/core';
import { SharedExportModule } from '../../shared/shared.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [SharedExportModule]
})
export class HeaderComponent {}
