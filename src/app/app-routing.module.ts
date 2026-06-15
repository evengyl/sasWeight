import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './shared/core/auth/auth.guard';
import { LoginComponent } from './shared/core/auth/login/login.component';

const routes: Routes = [
  { path : "", component : DashboardComponent, canActivate : [AuthGuard] },
  { path : "login", component : LoginComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
