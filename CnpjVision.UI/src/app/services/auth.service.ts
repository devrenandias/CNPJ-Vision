import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
} from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data);
  }
}
