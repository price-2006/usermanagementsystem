import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
