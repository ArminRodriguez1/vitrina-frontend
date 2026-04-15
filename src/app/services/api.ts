import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://vitrina-backend.onrender.com/api/v1/catalog';

  constructor(private http: HttpClient) { }

  getTiendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stores/`);
  }
  getTienda(id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/stores/${id}/`);
}
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/`);
  }

getProductos(search: string = '', category: string = '', ordering: string = ''): Observable<any> {
    let url = `${this.baseUrl}/products/?`;
    if (search) url += `search=${search}&`;
    if (category) url += `category=${category}&`;
    if (ordering) url += `ordering=${ordering}&`;
    return this.http.get<any>(url);
  }

  tirarGachapon(tipo: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/draw-gacha/`, { tipo: tipo });
  }

  getProductosPorTienda(storeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/?store=${storeId}`);
  }
  getPagina(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  pingBackend():  Observable<any>{
    return this.http.get(`${this.baseUrl}/ping/`);
  }

  // --- MÉTRICAS DEL DASHBOARD ---
  registrarVistaProducto(productoId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/${productoId}/add_view/`, {});
  }

  registrarClicContacto(productoId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/${productoId}/add_click/`, {});
  }
  obtenerDashboardTienda(): Observable<any> {
    // Fíjate que es un GET, no le mandamos nada porque Django nos reconoce por el Token
    return this.http.get<any>(`${this.baseUrl}/my-dashboard/`);
  }
}