import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import { Cliente } from './cadastro/cliente';

describe('ClienteService', () => {
  let service: ClienteService;
  let setItemSpy: jasmine.Spy;

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

  afterEach(() =>{
    localStorage.clear(); // Limpa localStorage após cada teste
   
  })

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

  it('should return all clientes if nomeBusca is empty', () => {
    const mockClientes: Cliente[] = [
      { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false },
      { id: '2', nome: 'Maria', cpf: '', dataNascimento: '', email: '', deletando: false }
    ];
    spyOn(service, 'obterStorage').and.returnValue(mockClientes);

    const result = service.pesquisarClientes('');
    expect(result).toEqual(mockClientes);
  });

  it('should return matching clientes when nomeBusca is provided', () => {
    const mockClientes: Cliente[] = [
      { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false },
      { id: '2', nome: 'Maria', cpf: '', dataNascimento: '', email: '', deletando: false }
    ];
    spyOn(service, 'obterStorage').and.returnValue(mockClientes);

    const result = service.pesquisarClientes('Jo');
    expect(result).toEqual([mockClientes[0]]);
  });

  it('should return empty array if no cliente matches', () => {
    const mockClientes: Cliente[] = [
      { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false }
    ];
    spyOn(service, 'obterStorage').and.returnValue(mockClientes);

    const result = service.pesquisarClientes('Zé');
    expect(result.length).toBe(0);
  });

  
  it('should update cliente data', () => {
  const clienteOriginal = { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false };
  const clienteAtualizado = { ...clienteOriginal, nome: 'João Silva' };
  const storage = [clienteOriginal];
  spyOn(service, 'obterStorage').and.returnValue(storage);
  service.atualizar(clienteAtualizado);
  expect(storage[0].nome).toBe('João Silva');
  });
  
  it('should remove cliente from storage and save new list', () => {
    const cliente1 = { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false };
    const cliente2 = { id: '2', nome: 'Maria', cpf: '', dataNascimento: '', email: '', deletando: false };
    const storage = [cliente1, cliente2];
    spyOn(service, 'obterStorage').and.returnValue(storage);
    service.deletar(cliente1);
    expect(service.obterStorage).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      ClienteService.REPO_CLIENTES,
      JSON.stringify([cliente2])
    );
  });

  it('should return the cliente with matching id', () => {
  const cliente1 = { id: '1', nome: 'João', cpf: '', dataNascimento: '', email: '', deletando: false };
  const cliente2 = { id: '2', nome: 'Maria', cpf: '', dataNascimento: '', email: '', deletando: false };
  const storage = [cliente1, cliente2];
  spyOn(service, 'obterStorage').and.returnValue(storage);
  const result = service.buscarClientePorId('2');
  expect(result).toEqual(cliente2);
});

});
