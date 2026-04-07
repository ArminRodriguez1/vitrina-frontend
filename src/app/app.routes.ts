import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Storefront } from './pages/storefront/storefront';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
    { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { path: '', component: HomeComponent },
  { path: 'tienda/:id', component: Storefront },
  { path: '**', redirectTo: '' },

];