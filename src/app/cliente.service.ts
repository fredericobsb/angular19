import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  static REPO_CLIENTES = "_CLIENTES";

  constructor() { }

  salvar(cliente: Cliente){
    console.log('---service salvando cliente');
    const storage = this.obterStorage();
    storage.push(cliente);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  obterStorage(): Cliente[]{
    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if(repositorioClientes){
      const listaClientes: Cliente[] = JSON.parse(repositorioClientes);
      return listaClientes;
    } 
    const listaClientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(listaClientes));
    return listaClientes;
  }


}
