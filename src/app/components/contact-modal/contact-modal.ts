import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api'; 

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-modal.html',
})
export class ContactModal implements OnInit, OnDestroy, OnChanges {
  @Input() producto: any;
  @Output() close = new EventEmitter<void>();
  
  errorGacha: string | null = null;
  codigoGachaGenerado: string | null = null;
  telefonoTienda = "56912345678"; 
  isRolling: boolean = false; // Variable para evitar doble clic mientras carga

  // Inyectamos el ApiService en el constructor
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnChanges() {
    if (this.producto) {
      // Siempre que se abre el modal, empezamos con la pizarra en blanco
      this.errorGacha = null; 
      this.codigoGachaGenerado = null; 
    }
    if (this.producto.id) {
        this.apiService.registrarVistaProducto(this.producto.id).subscribe({
          next: () => console.log('Vista registrada con éxito'),
          error: (err) => console.error('Error al registrar vista', err)
        });
      }
  }

  esGachaPokemon(): boolean {
    const titulo = this.producto?.title?.toLowerCase() || '';
    return titulo.includes('gachapón') && titulo.includes('pokémon');
  }
  
  esGachaMyL(): boolean {
    const titulo = this.producto?.title?.toLowerCase() || '';
    return titulo.includes('gachapón') && titulo.includes('mitos');
  }

tirarGacha(tipo: 'pokemon' | 'myl') {
    if (this.isRolling) return;

    this.isRolling = true;
    this.errorGacha = null;

    this.apiService.tirarGachapon(tipo).subscribe({
      next: (response) => {
        // 1. Imprimimos el paquete tal cual llega en la consola
        this.codigoGachaGenerado = response.codigo || response.code;
        console.log("¡Respuesta de Django llegó!", response);
        
        // 2. Le damos opciones a Angular por si llega en otro formato
        this.codigoGachaGenerado = response.codigo || response.code || response;
        
        // 3. Guardamos solo si es un texto válido
        if (this.producto?.id && typeof this.codigoGachaGenerado === 'string') {
          localStorage.setItem(`gacha_${this.producto.id}`, this.codigoGachaGenerado);
        }
        
        // 4. Aseguramos desbloquear el botón
        this.isRolling = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.errorGacha = "Error al abrir el paquete. Revisa la consola.";
        this.isRolling = false;
      }
    });
  }
  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }
registrarClicYRedirigir(callbackUrl: () => void) {
    if (this.producto?.id) {
      this.apiService.registrarClicContacto(this.producto.id).subscribe({
        next: () => {
          console.log('Clic registrado con éxito');
          callbackUrl(); // Ejecuta la redirección
        },
        error: (err) => {
          console.error('Error al registrar clic', err);
          callbackUrl(); // Aunque falle la analítica, igual redirigimos al cliente
        }
      });
    } else {
      callbackUrl();
    }
  }
  contactarWhatsApp() {
    const telefono = this.producto?.store_phone || this.telefonoTienda;
    let mensaje = `¡Hola ${this.producto?.store_name || ''}! Vengo de Vitrina Victoria. Me interesa: *${this.producto?.title}*.`;
    
    if (this.codigoGachaGenerado) {
      mensaje += `\n🎲 ¡Tiré el Gachapón en la página y me salió el código: *${this.codigoGachaGenerado}*! ¿Qué me gané?`;
    } else {
      mensaje += ` ¿Tienen disponibilidad?`;
    }

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  irAInstagram() {
    let ig = this.producto?.store_instagram;
    if (!ig) return;
    const url = ig.includes('http') ? ig : `https://instagram.com/${ig.replace('@', '')}`;
    window.open(url, '_blank');
  }

  irASitioWeb() {
    const web = this.producto?.store_website;
    if (web) window.open(web, '_blank');
  }

  cerrar() {
    this.close.emit();
  }
}