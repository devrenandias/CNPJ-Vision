import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';

@Component({
  selector: 'app-empresa-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empresa-detalhe.component.html',
  styleUrl: './empresa-detalhe.component.css',
})
export class EmpresaDetalheComponent implements OnInit, OnDestroy {
  empresa: Empresa | null = null;
  carregando = false;
  erro = '';
  mostrarModalExclusao = false;

  mostrarToast: boolean = false;
  mensagemToast: string = '';
  tipoToast: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarEmpresa(+id);
    } else {
      this.erro = 'ID da empresa não fornecido';
    }
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  carregarEmpresa(id: number): void {
    this.carregando = true;
    this.empresaService.obterEmpresaPorId(id).subscribe({
      next: (res) => {
        this.empresa = res;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao carregar dados da empresa';
        this.carregando = false;
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/empresas']);
  }

  confirmarExclusao(): void {
    this.mostrarModalExclusao = true;
  }

  cancelarExclusao(): void {
    this.mostrarModalExclusao = false;
  }

  excluirEmpresa(): void {
    if (!this.empresa?.id) return;

    const nomeEmpresa =
      this.empresa.nomeFantasia || this.empresa.nomeEmpresarial;

    this.empresaService.excluirEmpresa(this.empresa.id).subscribe({
      next: () => {
        this.mostrarModalExclusao = false;

        this.exibirToast(
          `Empresa "${nomeEmpresa}" foi excluída com sucesso!`,
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/empresas']);
        }, 1500);
      },
      error: (err) => {
        this.mostrarModalExclusao = false;

        const mensagemErro =
          err.error?.mensagem || 'Erro ao excluir empresa. Tente novamente.';
        this.exibirToast(mensagemErro, 'error');
      },
    });
  }

  exibirToast(mensagem: string, tipo: 'success' | 'error' = 'success'): void {
    this.mensagemToast = mensagem;
    this.tipoToast = tipo;
    this.mostrarToast = true;

    this.toastTimeout = setTimeout(() => {
      this.fecharToast();
    }, 4000);
  }

  fecharToast(): void {
    this.mostrarToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  verNoMapa(): void {
    if (!this.empresa) return;
    const endereco = `${this.empresa.logradouro}, ${this.empresa.numero}, ${this.empresa.municipio}, ${this.empresa.uf}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      endereco
    )}`;
    window.open(url, '_blank');
  }

  recarregar(): void {
    window.location.reload();
  }

  formatarCNPJ(cnpj: string): string {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }

  formatarCEP(cep: string): string {
    return cep.replace(/^(\d{5})(\d{3})/, '$1-$2');
  }

  getStatusClass(situacao: string): string {
    switch (situacao?.toLowerCase()) {
      case 'ativa':
        return 'ativa';
      case 'inativa':
        return 'inativa';
      case 'suspensa':
        return 'suspensa';
      default:
        return 'inativa';
    }
  }

  getStatusIcon(situacao: string): string {
    switch (situacao?.toLowerCase()) {
      case 'ativa':
        return 'fas fa-check-circle';
      case 'inativa':
        return 'fas fa-times-circle';
      case 'suspensa':
        return 'fas fa-pause-circle';
      default:
        return 'fas fa-question-circle';
    }
  }
}
