import { Component } from '@angular/core';
import { ListPersonsComponent } from '../../features/list-persons/list-persons.component';

@Component({
  selector: 'app-dashboard',
  template: '<app-list-persons></app-list-persons>',
  imports: [ListPersonsComponent]
})
export class DashboardComponent {}
