import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CadastroComponent } from './cadastro.component';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let clienteService: ClienteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
       providers: [
        provideAnimations(),
        ClienteService,// garante que o service será injetado
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              params: {id: 1}  // Pode simular params aqui se quiser testar outros casos
            })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    clienteService = TestBed.inject(ClienteService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save a cliente', () =>{
   const spy = spyOn(clienteService, 'salvar');
   component.salvar();
   expect(spy).toHaveBeenCalled();
  })

  it('should set atualizando to true and set cliente when id is found', () => {
    const mockCliente = Cliente.newCliente();
    const id = mockCliente.id;

    // Mock do ActivatedRoute para retornar um id
    const activatedRoute = TestBed.inject(ActivatedRoute) as any;
    activatedRoute.queryParamMap = of({
      params: { id: id }
    });

    // Spy no clienteService para retornar um cliente
    spyOn(clienteService, 'buscarClientePorId').and.returnValue(mockCliente);

    component.ngOnInit();

    expect(component.atualizando).toBeTrue();
    expect(component.cliente).toEqual(mockCliente);
  });

  it('should update cliente when atualizando is true', () => {
    component.atualizando = true;
    const spy = spyOn(clienteService, 'atualizar');
    component.salvar();
    expect(spy).toHaveBeenCalledWith(component.cliente);
  });
});
