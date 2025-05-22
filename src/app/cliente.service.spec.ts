import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import { Cliente } from './cadastro/cliente';

describe('ClienteService', () => {
  let service: ClienteService;

  const mockLocalStorage = (() =>{
    let store: {[key:string]:string} = {};
    return {
      getItem: (key:string) => store[key] || null,
      setItem: (key:string, value: string) => store[key] = value,
      clear: () => store = {},
      removeItem: (key: string) => delete store[key]
    };
  })();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteService);
    spyOn(console, 'log');
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
    mockLocalStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a client', () =>{
    const cliente: Cliente = {} as Cliente;
    service.salvar(cliente);
    expect(console.log).toHaveBeenCalledWith('---service salvando cliente');
    const savedData = JSON.parse(mockLocalStorage.getItem(ClienteService.REPO_CLIENTES)!);
    expect(savedData.length).toBe(1);
    expect(savedData[0]).toEqual(cliente);
  })

  it('should return an empty array when storage is empty', () => {
    const storage = service.obterStorage();
    expect(storage).toEqual([]);
    expect(mockLocalStorage.getItem(ClienteService.REPO_CLIENTES)).toEqual(JSON.stringify([]));
  });

  it('should retrieve existing clients from storage', () => {
    const existingClientes: Cliente[] = [{ nome: 'Cliente1' } as Cliente];
    mockLocalStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(existingClientes));
    const storage = service.obterStorage();
    expect(storage).toEqual(existingClientes);
  });
});
