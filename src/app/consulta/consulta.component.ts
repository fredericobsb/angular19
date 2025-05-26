import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule } from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta',
  imports: [
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent {

  listaClientes: Cliente[] = [];
  nomeBusca!: string;
  columnsTable:string[] = ["id","nome","cpf","dataNascimento", "email", "acoes"];

  constructor(private clienteService: ClienteService,
              private router: Router
  ){}

  ngOnInit(){
   //ANGULAR18 - nao precisa mais implementar NgOnInit
    this.listaClientes = this.clienteService.pesquisarClientes('');
  }

  pesquisar(){
    return this.clienteService.pesquisarClientes(this.nomeBusca);
  }

  preparaEditar(id:string){
    this.router.navigate(['/cadastro'], {queryParams: {"id": id}});
  }

}
