import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header {
  constructor(private router: Router) {}

  buscar(termino: string) {
    if (termino.trim()) {
      // Navegamos a la Home pasándole el término en la URL (?q=algo)
      this.router.navigate(['/'], { queryParams: { q: termino } });
    } else {
      this.router.navigate(['/']);
    }
  }
}