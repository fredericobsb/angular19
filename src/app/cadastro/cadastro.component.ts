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
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.model';
import { throwError } from 'rxjs';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [FlexLayoutModule, 
            MatCardModule,
            FormsModule,
            MatFormFieldModule, 
            MatInputModule, 
            MatIconModule,
            MatButtonModule,
            NgxMaskDirective,
            MatSelectModule,
            CommonModule
          ],
  providers: [
    provideNgxMask()
  ],

  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  atualizando: Boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  listaEstados: Estado[] = [];
  listaMunicipios: Municipio[] = [];

  constructor(private clienteService: ClienteService,
              private route: ActivatedRoute,
              private brasilApiService: BrasilapiService
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
            if(this.cliente.uf){
              const event = {value: this.cliente.uf}
              this.carregarMunicipios(event as MatSelectChange);
            }
        }
      }
    })
    this.carregarUFs();
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

  carregarUFs(){
    return this.brasilApiService.listarUFs().subscribe({
      next: listaRetornadaDeEstados => {
        this.listaEstados = listaRetornadaDeEstados,
        console.log('---- this.listaEstados -->', this.listaEstados)},
      error: erro => console.error("Erro ao buscar lista de estados na API ==> ", erro),
    })
  }

  carregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipiosRetornadaDaApi => this.listaMunicipios = listaMunicipiosRetornadaDaApi,
      error: erro =>console.error("Erro ao buscar lista de municipios na API ==> ", erro)
    })
  }
 
}
