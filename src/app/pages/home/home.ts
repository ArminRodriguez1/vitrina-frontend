import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { ProductCard } from '../../components/product-card/product-card';
import { ContactModal } from '../../components/contact-modal/contact-modal';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, ProductCard, ContactModal, RouterModule], 
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  banners = [
    {
      id: 0,
      imageUrl:'https://fbizxprxdppwwaquebzt.supabase.co/storage/v1/object/public/vitrina-media/productos/pknm_banner.png', 
      link: '/tienda/3',
      alt: 'Preventa Pokémon Chaos Rising'
    },
    {
      id: 1,
      imageUrl: 'https://fbizxprxdppwwaquebzt.supabase.co/storage/v1/object/public/vitrina-media/productos/infinity-banner.png', 
      link: '/tienda/1',
      alt: 'Mitos y Leyendas - Chile Oculto'
    },
    {
      id: 2,
      imageUrl: 'https://fbizxprxdppwwaquebzt.supabase.co/storage/v1/object/public/vitrina-media/productos/pre-my-banner.png', 
      link: '/tienda/3',
      alt: 'One Piece Card Game OP14'
    }
  ];

  currentSlideIndex = 0;
  autoScrollInterval: any;
  scrollTimer: any;
  
  comercios: any[] = [];
  productosGlobales: any[] = [];
  categorias: any[] = [];
  
  productoSeleccionado: any = null;
  categoriaActiva: string = '';
  terminoBusqueda: string = '';
  nextUrl: string | null = null;
  prevUrl: string | null = null;
  ordenPrecio: string = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 1. ELIMINAMOS EL THROW ERROR
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearAutoScroll();
    }
  }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarCategorias(); // Añadido para que aparezcan tus píldoras de filtros
    this.cargarProductos();
    
    this.route.queryParams.subscribe(params => {
      this.terminoBusqueda = params['q'] || '';
      this.cargarProductos(); 
    });

    // 2. ESCUDO ANTI-NODE PARA EL CARRUSEL
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoScroll();
    }
  }

  startAutoScroll() {
    this.clearAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlideIndex + 1) % this.banners.length;
    this.goToSlide(nextIndex);
  }

  goToSlide(index: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.carouselContainer) return;
    const container = this.carouselContainer.nativeElement as HTMLElement;
    if (container && 'scrollTo' in container) {
      const scrollAmount = index * container.offsetWidth;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      this.currentSlideIndex = index;
      this.cdr.detectChanges();
    }
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data.results ? data.results : data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e)
    });
  }

  cargarTiendas() {
    this.apiService.getTiendas().subscribe({
      next: (data: any) => {
        this.comercios = data.results ? data.results : data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error tiendas:', err)
    });
  }

  cargarProductos() {
    this.apiService.getProductos(this.terminoBusqueda, this.categoriaActiva, this.ordenPrecio).subscribe({
      next: (data: any) => {
        this.productosGlobales = data.results ? data.results : data;
        this.nextUrl = data.next || null;
        this.prevUrl = data.previous || null;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e)
    });
  }

  seleccionarCategoria(idCat: string) {
    this.categoriaActiva = this.categoriaActiva === idCat ? '' : idCat;
    this.cargarProductos();
  }

  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
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
        this.productosGlobales = data.results ? data.results : data;
        this.nextUrl = data.next || null;
        this.prevUrl = data.previous || null;
        
        // 3. ESCUDO ANTI-NODE PARA EL SCROLL DE VENTANA
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  cambiarOrden(event: any) {
    this.ordenPrecio = event.target.value;
    this.cargarProductos();
  }

  handleCarouselScroll(event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = setTimeout(() => {
      const container = event.target as HTMLElement;
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      const normalizedIndex = Math.max(0, Math.min(index, this.banners.length - 1));

      if (this.currentSlideIndex !== normalizedIndex) {
        this.currentSlideIndex = normalizedIndex;
        this.cdr.detectChanges();
      }
    }, 100);
  }

  handleCarouselInteraction() {
    if (isPlatformBrowser(this.platformId)) {
      this.clearAutoScroll();
    }
  }
}