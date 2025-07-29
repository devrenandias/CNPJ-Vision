import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/empresa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  cadastrarEmpresa(cnpj: string): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrl}/empresa/${cnpj}`, {});
  }

  listarEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/empresa`);
  }

  obterEmpresaPorId(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/empresa/${id}`);
  }

  excluirEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/empresa/${id}`);
  }
}
