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

  pesquisarClientes(nomeBusca:string) : Cliente[]{
    const listaClientes = this.obterStorage();
    if(!nomeBusca){
      return listaClientes;
    }
    return listaClientes.filter(cliente => cliente.nome?.indexOf(nomeBusca) !== -1);
  }

  buscarClientePorId(id:string): Cliente | undefined {
    const listaClientes = this.obterStorage();
    return listaClientes.find(cliente => cliente.id === id);
  }

   atualizar(cliente: Cliente){
     const storage = this.obterStorage();
     storage.forEach(c => {
      if(c.id === cliente.id){
        Object.assign(c, cliente);
      }
     })
     localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  deletar(cliente: Cliente){
    const storage = this.obterStorage();
    const novaLista = storage.filter(c => c.id !== cliente.id);
    const indexItemASerDeletado = storage.indexOf(cliente);
    if(indexItemASerDeletado > -1){
      storage.splice(indexItemASerDeletado, 1);
    }
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista));
  }
}
