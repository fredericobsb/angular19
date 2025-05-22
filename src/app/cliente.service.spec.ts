import { TestBed } from '@angular/core/testing';

import { ClienteService } from './cliente.service';
import { Cliente } from './cadastro/cliente';

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a client', () =>{
    const cliente: Cliente = {} as Cliente;
    spyOn(console, 'log');
    service.salvar(cliente);
    expect(console.log).toHaveBeenCalledWith('---service salvando cliente');
  })
});
