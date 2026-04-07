import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { ProductCard } from '../../components/product-card/product-card';
import { ContactModal } from '../../components/contact-modal/contact-modal';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule, Header, ProductCard, ContactModal, RouterModule],
  templateUrl: './storefront.html',
})
export class Storefront implements OnInit {
  tiendaId: string | null = null;
  tienda: any = null;
  nombreTienda: string = 'Cargando tienda...';
  productos: any[] = [];
  productoSeleccionado: any = null;
  nextUrl: string | null = null;
  prevUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tiendaId = params.get('id');
      if (this.tiendaId) {
        this.cargarTienda(this.tiendaId); // Nueva función
        this.cargarProductosDeTienda(this.tiendaId);
      }
    });
  }
  cargarTienda(id: string) {
    this.apiService.getTienda(id).subscribe({
      next: (data) => {
        this.tienda = data;
        this.cdr.detectChanges();
      }
    });
  }

 cargarProductosDeTienda(id: string) {
  this.apiService.getProductosPorTienda(id).subscribe({
    next: (data: any) => {
      // Si data.results existe, es porque llegó paginado
      this.productos = data.results ? data.results : data;
      this.nextUrl = data.next || null;
      this.prevUrl = data.previous || null;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error al cargar tienda:', err)
  });
}

  abrirModal(prod: any) {
    this.productoSeleccionado = prod;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModal() {
    this.productoSeleccionado = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }
  cambiarPagina(url: string | null) {
  if (!url) return;
  this.apiService.getPagina(url).subscribe({
    next: (data: any) => {
      this.productos = data.results ? data.results : data;
      this.nextUrl = data.next || null;
      this.prevUrl = data.previous || null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.cdr.detectChanges();
    }
  });
}
}