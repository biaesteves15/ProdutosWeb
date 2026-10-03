import { Routes } from '@angular/router';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { CadastrarProdutos } from './components/pages/cadastrar-produtos/cadastrar-produtos';
import { ConsultarProdutos } from './components/pages/consultar-produtos/consultar-produtos';
import { EditarProdutos } from './components/pages/editar-produtos/editar-produtos';

export const routes: Routes = [
    {
        path: 'dashboard', //rota
        component: Dashboard //componente
    },
    {
        path: 'cadastrar-produtos', //rota
        component: CadastrarProdutos //componente
    },
    {
        path: 'consultar-produtos', //rota
        component: ConsultarProdutos //componente
    },
    {
        path: 'editar-produtos/:id', //rota com parâmetro
        component: EditarProdutos //componente
    },
    {
        path: '', pathMatch: 'full', //rota padrão do projeto
        redirectTo: '/dashboard' //redirecionamento
    }
];
