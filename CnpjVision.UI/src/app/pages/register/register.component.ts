import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  erro: string = '';
  sucesso: string = '';
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.senhasIguais }
    );
  }

  senhasIguais(group: AbstractControl) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    const dadosRegistro = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      senha: this.form.value.senha,
    };

    this.authService.register(dadosRegistro).subscribe({
      next: () => {
        this.sucesso =
          'Cadastro realizado com sucesso! Você será redirecionado para o login.';
        this.form.reset();
        this.carregando = false;

        setTimeout(() => {
          this.sucesso = '';
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao cadastrar usuário.';
        this.carregando = false;
      },
    });
  }
}
