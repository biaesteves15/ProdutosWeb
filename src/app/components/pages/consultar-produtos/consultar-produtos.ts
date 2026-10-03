import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-consultar-produtos',
  styleUrl: './consultar-produtos.css',
  templateUrl: './consultar-produtos.html',
})
export class ConsultarProdutos {

  // Atributo
  private apiUrl = environment.apiUrl;

  // Injeção de dependência
  private http = inject(HttpClient);

  // Função signal para armazenar os produtos obtidos da API
  produtos = signal<any[]>([]);

  // Mensagem de sucesso
  mensagemSucesso = '';

  // Produto selecionado para exclusão
  produtoSelecionado: any = null;

  // Estrutura de formulário
  formulario = new FormGroup({

    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

  });

  // Função executada quando o formulário é enviado (submit)
  consultar() {

    const nome = this.formulario.get('nome')?.value;

    this.http.get(this.apiUrl + '/produtos?nome=' + nome)
      .subscribe((data) => {

        this.produtos.set(data as any[]);

      });

  }

  // Abre a confirmação de exclusão
  excluir(id: string) {

    this.produtoSelecionado = id;

  }

  // Confirma a exclusão do produto
  confirmarExclusao() {

    if (!this.produtoSelecionado) {
      return;
    }

    this.http.delete(this.apiUrl + '/produtos/' + this.produtoSelecionado)
      .subscribe((data: any) => {

        // fecha a confirmação
        this.produtoSelecionado = null;

        // exibe mensagem de sucesso
        this.mensagemSucesso = 'Produto excluído com sucesso!';

        // atualiza a lista de produtos
        this.consultar();

      });

  }

  // Cancela a exclusão
  cancelarExclusao() {

    this.produtoSelecionado = null;

  }

  // Fecha a mensagem de sucesso
  fecharMensagem() {

    this.mensagemSucesso = '';

  }
  editar(id: string) {

    // redireciona para a página de edição de produtos
    window.location.href = '/editar-produtos/' + id;
  }
}