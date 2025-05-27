import { Component, inject } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro',
  imports: [FlexLayoutModule, 
            MatCardModule,
            FormsModule,
            MatFormFieldModule, 
            MatInputModule, 
            MatIconModule,
            MatButtonModule,
            NgxMaskDirective
          ],
  providers: [
    provideNgxMask()
  ],

  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  atualizando: Boolean = false;
  snack: MatSnackBar = inject(MatSnackBar)

  constructor(private clienteService: ClienteService,
              private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.route.queryParamMap.subscribe((query:any) =>{
      const parametros = query['params'];
      const id = parametros['id'];
      if(id){
        //se a busca der undefined, retornará um novo cliente vazio.
        let clienteEncontrado = this.clienteService.buscarClientePorId(id);
        if(clienteEncontrado){
            this.atualizando = true;
            this.cliente = clienteEncontrado;
        }
      }
    })
  }

  cliente: Cliente = Cliente.newCliente();

  salvar(){
    if(!this.atualizando){
      this.clienteService.salvar(this.cliente);
      this.mostrarMensagemAoUsuario("Usuario salvo com sucesso!");
      this.cliente = Cliente.newCliente();
    } else {
      this.clienteService.atualizar(this.cliente);
       this.mostrarMensagemAoUsuario("Usuario atualizado com sucesso!");
    }
  }

  mostrarMensagemAoUsuario(mensagem: string){
    this.snack.open(mensagem, "OK");
  }
 
}
