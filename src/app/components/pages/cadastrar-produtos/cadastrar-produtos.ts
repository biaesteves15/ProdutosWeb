import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';

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
  //atributo para armazenar o endpoint da API
  private apiUrl = environment.apiUrl;

  //injeção de dependência
  private http = inject(HttpClient);

  //variável para armazenar as categorias obtidas da API
  categorias = signal<any[]>([]);

  mensagemSucesso = signal('');
  mensagemErro = signal('');

   //estrutura do formulário
  formulario = new FormGroup({
    nome : new FormControl('', [Validators.required]),
    preco : new FormControl('', [Validators.required]),
    quantidade : new FormControl('', [Validators.required]),
    tipo : new FormControl('', [Validators.required]),
    categoria_id : new FormControl('', [Validators.required])
  });

  //Método executado quando o componente é inicializado
  ngOnInit() {
    //Fazendo uma requisição para a API
    this.http.get(`${this.apiUrl}/categorias`)
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

  this.http.post(`${this.apiUrl}/produtos`, this.formulario.value)
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
