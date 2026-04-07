import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule, Header, ProductCard],
  templateUrl: './storefront.component.html',
})
export class StorefrontComponent {
  // Datos falsos para probar el diseño rápido
  productos = [
    { nombre: 'Pan Amasado', descripcion: 'Pan tradicional hecho a mano', precio: '1.500', destacado: true, stock: true, imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
    { nombre: 'Empanadas de Pino', descripcion: 'Empanadas caseras con carne', precio: '2.500', destacado: true, stock: true, imagen: 'https://images.unsplash.com/photo-1626200419188-f5a73221447e?w=500&q=80' },
    { nombre: 'Torta de Chocolate', descripcion: 'Bizcocho húmedo', precio: '15.000', destacado: false, stock: false, imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
  ];
}