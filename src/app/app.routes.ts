import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './shared/core/auth/auth.guard';
import { DashboardComponent } from './templates/dashboard/dashboard.component';

export const routes: Routes = [
    { path : "", component : DashboardComponent, canActivate : [AuthGuard] },
    { path : "login", component : LoginComponent },
];
