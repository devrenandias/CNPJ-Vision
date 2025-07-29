import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { EmpresaDetalheComponent } from './pages/empresa-detalhe/empresa-detalhe.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  { path: 'detalhes/:id', component: EmpresaDetalheComponent },
  { path: 'home', component: HomeComponent },
  { path: 'empresas', component: EmpresasComponent },
];
