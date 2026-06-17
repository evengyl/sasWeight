import { Component } from '@angular/core';
import { SharedExportModule } from '../../shared/sharedExport.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [SharedExportModule]
})
export class HeaderComponent {}
