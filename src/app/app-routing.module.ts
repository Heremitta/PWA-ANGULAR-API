import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroSeguroComponent } from './components/cadastro-seguro/cadastro-seguro.component';
import { ListarSegurosComponent } from './components/listar-seguros/listar-seguros.component';

const routes: Routes = [
  {path: 'cadastro', component: CadastroSeguroComponent},
  {path: 'listar', component: ListarSegurosComponent},
  {path: '', pathMatch: 'full', redirectTo: 'cadastro'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
