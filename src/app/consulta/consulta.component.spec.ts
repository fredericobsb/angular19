import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConsultaComponent } from './consulta.component';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { Router } from '@angular/router';

describe('ConsultaComponent', () => {
  let component: ConsultaComponent;
  let fixture: ComponentFixture<ConsultaComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['pesquisarClientes', 'deletar']);
    
    await TestBed.configureTestingModule({
      imports: [ConsultaComponent],
      providers: [
              provideAnimations(),
              { provide: ClienteService, useValue: clienteServiceSpy },
              { provide: Router, useValue: routerSpy }
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pesquisar', () => {
    let cliente1 = Cliente.newCliente();
    let cliente2 = Cliente.newCliente();
    let listaClientes = [cliente1, cliente2];
    clienteServiceSpy.pesquisarClientes.and.returnValue(listaClientes);
    const result = component.pesquisar();
    expect(clienteServiceSpy.pesquisarClientes).toHaveBeenCalledWith(component.nomeBusca);
    expect(result).toEqual(listaClientes);
  });

  it('should navigate to cadastro with id param when preparaEditar is called', () => {
    const id = '123';
    component.preparaEditar(id);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/cadastro'], { queryParams: { id: id } });
  });

  it('should set cliente.deletando to true when preparaDeletar is called', () => {
    const cliente = Cliente.newCliente();
    cliente.deletando = false;  // garantia que começa como false
    component.preparaDeletar(cliente);
    expect(cliente.deletando).toBeTrue();
  });

  it('should call clienteService.deletar and update listaClientes when deletar is called', () =>{
    const cliente = Cliente.newCliente();
    const listaAtualizada = [Cliente.newCliente()];
    clienteServiceSpy.pesquisarClientes.and.returnValue(listaAtualizada);
    component.deletar(cliente);
    expect(clienteServiceSpy.deletar).toHaveBeenCalledWith(cliente);
    expect(clienteServiceSpy.pesquisarClientes).toHaveBeenCalledWith('');
    expect(component.listaClientes).toEqual(listaAtualizada);
  })


});
