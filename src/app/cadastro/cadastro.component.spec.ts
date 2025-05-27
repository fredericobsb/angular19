import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { CadastroComponent } from './cadastro.component';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { BrasilapiService } from '../brasilapi.service';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let clienteService: ClienteService;
  let brasilApiServiceSpy: jasmine.SpyObj<BrasilapiService>;
  let clienteFixo: Cliente;

  beforeEach(async () => {
    brasilApiServiceSpy = jasmine.createSpyObj('BrasilapiService', ['listarUFs', 'listarMunicipios']);
    // Mock padrão para listarUFs e listarMunicipios, evitando erro de subscribe
    brasilApiServiceSpy.listarUFs.and.returnValue(of([]));  // retorna Observable vazio
    brasilApiServiceSpy.listarMunicipios.and.returnValue(of([]));  // idem
    
    await TestBed.configureTestingModule({
      imports: [CadastroComponent, HttpClientModule],
       providers: [
        provideAnimations(),
        ClienteService,// garante que o service será injetado
        { provide: BrasilapiService, useValue: brasilApiServiceSpy },
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
    // Criar o cliente fixo com ID estático para evitar problemas de comparação
    clienteFixo = Cliente.newCliente();
    clienteFixo.id = 'f44d917f-8ea1-4262-b495-cd9eb87efee6';

    // Configurar o cliente do componente para ser esse fixo
    component.cliente = clienteFixo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save a cliente', () =>{
   const spy = spyOn(clienteService, 'salvar');
   component.salvar();
   expect(spy).toHaveBeenCalledWith(clienteFixo);
  })

  it('should set atualizando to true and set cliente when id is found', () => {
    // Mock do ActivatedRoute para retornar um id
    const activatedRoute = TestBed.inject(ActivatedRoute) as any;
    activatedRoute.queryParamMap = of({
      params: { id: clienteFixo.id }
    });

    // Spy no clienteService para retornar um cliente
    spyOn(clienteService, 'buscarClientePorId').and.returnValue(clienteFixo);

    component.ngOnInit();

    expect(component.atualizando).toBeTrue();
    expect(component.cliente).toEqual(clienteFixo);
  });

  it('should update cliente when atualizando is true', () => {
    component.atualizando = true;
    const spy = spyOn(clienteService, 'atualizar');
    component.salvar();
    expect(spy).toHaveBeenCalledWith(clienteFixo);
  });

  it('should call carregarMunicipios when cliente.uf is present', () => {
    clienteFixo.uf = 'SP';

    // Spy no clienteService para retornar esse cliente
    spyOn(clienteService, 'buscarClientePorId').and.returnValue(clienteFixo);

    // Spy no método carregarMunicipios
    const carregarMunicipiosSpy = spyOn(component, 'carregarMunicipios');
    component.ngOnInit();

    // Como o cliente possui UF, espera-se que carregarMunicipios seja chamado
    expect(carregarMunicipiosSpy).toHaveBeenCalledWith({ value: 'SP' } as MatSelectChange);
  });

  it('should handle error when carregarUFs fails', () => {
    const errorResponse = new Error('Erro simulado');

    // Simula erro na chamada listarUFs()
    brasilApiServiceSpy.listarUFs.and.returnValue(throwError(() => errorResponse));
    const consoleSpy = spyOn(console, 'error');
    component.carregarUFs();

    expect(brasilApiServiceSpy.listarUFs).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Erro ao buscar lista de estados na API ==> ", errorResponse);
   
  });

  it('should handle error when carregarMunicipios fails', () => {
    const mockEvent = { value: 'SP', source: {} } as MatSelectChange;
    const errorResponse = new Error('Erro simulado');
    // Força o erro
    brasilApiServiceSpy.listarMunicipios.and.returnValue(throwError(() => errorResponse));
    // Espiona o console.error
    const consoleSpy = spyOn(console, 'error');
    component.carregarMunicipios(mockEvent);
    // Verifica que chamou o listarMunicipios com a UF correta
    expect(brasilApiServiceSpy.listarMunicipios).toHaveBeenCalledWith('SP');
    // Verifica que o console.error foi chamado com a mensagem correta
    expect(consoleSpy).toHaveBeenCalledWith(
     "Erro ao buscar lista de municipios na API ==> ",
     errorResponse
    );
  });

  it('should show a message to user', () => {
    const snackSpy = spyOn(component['snack'], 'open');
    component.mostrarMensagemAoUsuario('Teste');
    expect(snackSpy).toHaveBeenCalledWith('Teste', 'OK');
  });

  it('should load municipios on carregarMunicipios', () => {
    const mockMunicipios = [{ nome: 'São Paulo',codigo_ibge: '3550308' }];
    brasilApiServiceSpy.listarMunicipios.and.returnValue(of(mockMunicipios));

    component.carregarMunicipios({ value: 'SP' } as MatSelectChange);

    expect(brasilApiServiceSpy.listarMunicipios).toHaveBeenCalledWith('SP');
    expect(component.listaMunicipios).toEqual(mockMunicipios);
  });

  it('should call salvar and reset cliente when atualizando is false', () => {
    component.atualizando = false;
    const clienteOriginal = Cliente.newCliente();
    component.cliente = clienteOriginal;
    const spySalvar = spyOn(clienteService, 'salvar');
    component.salvar();


    expect(spySalvar).toHaveBeenCalledWith(clienteOriginal);
    expect(component.cliente).not.toBe(clienteOriginal);
    expect(component.cliente.id).not.toEqual(clienteOriginal.id);
  });

  it('should not set atualizando when no id is provided', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute) as any;
    activatedRoute.queryParamMap = of({
      params: {}  // sem ID
    });

    const buscarSpy = spyOn(clienteService, 'buscarClientePorId');

    component.ngOnInit();

    expect(buscarSpy).not.toHaveBeenCalled();
    expect(component.atualizando).toBeFalse();
  });

  it('should handle error when carregarUFs fails', () => {
    const errorResponse = { status: 500, message: 'Internal Server Error' };

    brasilApiServiceSpy.listarUFs.and.returnValue(throwError(() => errorResponse));

    expect(() => component.carregarUFs()).not.toThrow();

    expect(brasilApiServiceSpy.listarUFs).toHaveBeenCalled();
});
});
