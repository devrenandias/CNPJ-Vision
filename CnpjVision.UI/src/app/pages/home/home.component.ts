import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userName: string = 'Usuário';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userName = user.nome || user.name || 'Usuário';
        console.log('Dados do usuário carregados:', user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.userName = 'Usuário';
      }
    }
  }

  irParaEmpresas(): void {
    this.router.navigate(['/empresas']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }

  getUserName(): string {
    return this.userName;
  }
}
