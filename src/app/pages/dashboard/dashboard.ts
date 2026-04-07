import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth/auth.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html' // Ahora apuntamos a un archivo HTML externo
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService.obtenerDashboardTienda().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error del backend:", err);
        this.error = err.error?.error || 'No se pudo cargar la información del panel.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}