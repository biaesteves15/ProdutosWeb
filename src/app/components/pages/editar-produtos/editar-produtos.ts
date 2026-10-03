import { CommonModule } from '@angular/common';

import { Component, inject, signal } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { environment } from '../../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-editar-produtos',
  styleUrl: './editar-produtos.css',
  templateUrl: './editar-produtos.html',
})
export class EditarProdutos {

  // Atributo
  private apiUrl = environment.apiUrl;

  // Injeção de dependência
  private http = inject(HttpClient);

  // Variável para armazenar as categorias obtidas da API
  categorias = signal<any[]>([]);

  // Armazenar o id do produto a ser editado
  id = '';

  // Mensagem de sucesso
  mensagemSucesso = '';

  // Biblioteca para capturar o ID enviado na URL
  private route = inject(ActivatedRoute);

  // Estrutura do formulário
  formulario = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    categoria_id: new FormControl('', [Validators.required])
  });

  // Método executado quando o componente é inicializado
  ngOnInit() {

    // Capturando o ID enviado na URL
    this.id = this.route.snapshot.paramMap.get('id') || '';

    // Fazendo uma requisição para a API
    this.http.get(this.apiUrl + '/produtos/' + this.id)
      .subscribe((data: any) => {

        // Preenchendo o formulário com os dados obtidos da API
        this.formulario.patchValue({
          nome: data.nome,
          preco: data.preco,
          quantidade: data.quantidade,
          tipo: data.tipo,
          categoria_id: data.categoria.id
        });

      });

    // Fazendo uma requisição para a API
    this.http.get(this.apiUrl + '/categorias')
      .subscribe((data) => {

        // Guardar os dados obtidos na variável 'categorias'
        this.categorias.set(data as any[]);

      });

  }

  // Método executado pelo formulário (SUBMIT)
 atualizar() {

  this.mensagemSucesso = 'Produto atualizado com sucesso!';

  this.http.patch(
    this.apiUrl + '/produtos/' + this.id,
    this.formulario.value
  )
    .subscribe();

}

  // Fechar mensagem
  fecharMensagem() {
    this.mensagemSucesso = '';
  }

}