import { Component } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';


@Component({
  selector: 'app-cadastro',
  imports: [FlexLayoutModule, 
            MatCardModule,
            FormsModule,
            MatFormFieldModule, 
            MatInputModule, 
            MatIconModule,
            MatButtonModule],

  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  constructor(private clienteService: ClienteService){}

  cliente: Cliente = Cliente.newCliente();

  salvar(){
    this.clienteService.salvar(this.cliente);
  }
}
