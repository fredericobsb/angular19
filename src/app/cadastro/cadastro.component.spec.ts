import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CadastroComponent } from './cadastro.component';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let clienteService: ClienteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
       providers: [
        provideAnimations(),
        ClienteService// garante que o service será injetado
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
   expect(spy).toHaveBeenCalledWith(component.cliente);
  })
});
