import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Empresa } from '../../models/empresa';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css',
})
export class EmpresasComponent implements OnInit, OnDestroy {
  private _cnpj: string = '';
  empresas: Empresa[] = [];
  erro: string = '';
  sucesso: string = '';
  filtro: string = '';
  carregando: boolean = false;
  empresaParaExcluir: Empresa | null = null;
  mostrarToast: boolean = false;
  mensagemToast: string = '';
  private toastTimeout: any;

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(private empresaService: EmpresaService, public router: Router) {}

  ngOnInit(): void {
    this.listarEmpresas();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  get cnpj(): string {
    return this._cnpj;
  }

  set cnpj(value: string) {
    const somenteNumeros = value.replace(/\D/g, '');
    const formatado = somenteNumeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
    this._cnpj = formatado;
  }

  get cnpjLimpo(): string {
    return this._cnpj.replace(/\D/g, '');
  }

  formatarCNPJ(cnpj: string): string {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }

  listarEmpresas(): void {
    this.empresaService.listarEmpresas().subscribe({
      next: (res) => {
        this.empresas = res;
        this.atualizarPaginacao();
      },
      error: () => {
        this.erro = 'Erro ao carregar empresas';
      },
    });
  }

  get empresasFiltradas(): Empresa[] {
    if (!this.filtro) return this.empresas;
    return this.empresas.filter(
      (emp) =>
        (emp.nomeFantasia || emp.nomeEmpresarial || '')
          .toLowerCase()
          .includes(this.filtro.toLowerCase()) || emp.cnpj.includes(this.filtro)
    );
  }

  get empresasPaginadas(): Empresa[] {
    const empresasFiltradas = this.empresasFiltradas;
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return empresasFiltradas.slice(inicio, fim);
  }

  atualizarPaginacao(): void {
    const empresasFiltradas = this.empresasFiltradas;
    this.totalItens = empresasFiltradas.length;
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);

    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1;
    }
  }

  onFiltroChange(): void {
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  
  get paginasVisiveis(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5; 

    let inicio = Math.max(1, this.paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(this.totalPaginas, inicio + maxPaginas - 1);

    if (fim - inicio + 1 < maxPaginas) {
      inicio = Math.max(1, fim - maxPaginas + 1);
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }


  alterarItensPorPagina(novosItens: number): void {
    this.itensPorPagina = novosItens;
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  
  get informacoesPaginacao(): string {
    if (this.totalItens === 0) return 'Nenhum item encontrado';

    const inicio = (this.paginaAtual - 1) * this.itensPorPagina + 1;
    const fim = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalItens
    );

    return `Mostrando ${inicio} a ${fim} de ${this.totalItens} empresas`;
  }

  cadastrarEmpresa(): void {
    if (!this.cnpjLimpo) return;

    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    this.empresaService.cadastrarEmpresa(this.cnpjLimpo).subscribe({
      next: () => {
        this._cnpj = '';
        this.listarEmpresas();
        this.exibirToast('Empresa cadastrada com sucesso!');
      },
      error: (err) => {
        if (err.status === 409) {
          
          this.erro = 'Essa empresa já está cadastrada.';
        } else {
          this.erro = err.error?.mensagem || 'Erro ao cadastrar empresa.';
        }
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  detalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  editar(id: number): void {
    this.router.navigate(['/editar', id]);
  }

  confirmarExclusao(empresa: Empresa): void {
    this.empresaParaExcluir = empresa;
  }

  cancelarExclusao(): void {
    this.empresaParaExcluir = null;
  }

  confirmarExclusaoFinal(): void {
    if (this.empresaParaExcluir) {
      const nomeEmpresa =
        this.empresaParaExcluir.nomeFantasia ||
        this.empresaParaExcluir.nomeEmpresarial;
      this.deletar(this.empresaParaExcluir.id);
      this.empresaParaExcluir = null;
      this.exibirToast(`Empresa "${nomeEmpresa}" foi excluída com sucesso!`);
    }
  }

  deletar(id: number): void {
    this.empresaService.excluirEmpresa(id).subscribe({
      next: () => {
        this.listarEmpresas();
      },
      error: () => {
        this.erro = 'Erro ao excluir empresa';
      },
    });
  }

  exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.mostrarToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.fecharToast();
    }, 4000);
  }

  fecharToast(): void {
    this.mostrarToast = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  trackByEmpresa(index: number, empresa: Empresa): number {
    return empresa.id;
  }
}
