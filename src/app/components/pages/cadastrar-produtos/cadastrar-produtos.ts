import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-cadastrar-produtos',
  styleUrl: './cadastrar-produtos.css',
  templateUrl: './cadastrar-produtos.html',
})
export class CadastrarProdutos {

  //injeção de dependência
  private http = inject(HttpClient);

  //variável para armazenar as categorias obtidas da API
  categorias = signal<any[]>([]);

  mensagemSucesso = signal('');
  mensagemErro = signal('');

  //estrutura do formulário
  formulario = new FormGroup({
    nome : new FormControl(''),
    preco : new FormControl(''),
    quantidade : new FormControl(''),
    tipo : new FormControl(''),
    categoria_id : new FormControl('')
  });

  //Método executado quando o componente é inicializado
  ngOnInit() {
    //Fazendo uma requisição para a API
    this.http.get('http://localhost:5097/api/v1/categorias')
      .subscribe((data) => {
        //guardar os dados obtidos na variavel 'categorias' (signal)
        this.categorias.set(data as any[]);
      });
  }

  //Método executado pelo formulário (SUBMIT)
  cadastrar() {
  // limpa mensagens anteriores
  this.mensagemSucesso.set('');
  this.mensagemErro.set('');

  this.http.post('http://localhost:5097/api/v1/produtos', this.formulario.value)
    .subscribe({
      next: (data: any) => {
        this.mensagemSucesso.set('Produto cadastrado com sucesso!');

        this.formulario.reset();

        setTimeout(() => {
          this.mensagemSucesso.set('');
        }, 3000);
      },

      error: (erro) => {
        console.error(erro);

        this.mensagemErro.set(
          'Não foi possível cadastrar o produto. Verifique os dados e tente novamente.'
        );

        setTimeout(() => {
          this.mensagemErro.set('');
        }, 5000);
      }
    });
}
}
