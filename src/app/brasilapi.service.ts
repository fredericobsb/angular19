import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado, Municipio } from './brasilapi.model';

@Injectable({
  providedIn: 'root'
})
export class BrasilapiService {

  baseURL: string = 'https://brasilapi.com.br/api';

  constructor(private httpClient: HttpClient) { }

  listarUFs(): Observable<Estado[]>{
    const path = '/ibge/uf/v1';
    return this.httpClient.get<Estado[]>(this.baseURL + path);
  }

  listarMunicipios(ufSelecionada: string): Observable<Municipio[]>{
    const path = '/ibge/municipios/v1/' + ufSelecionada;
    return this.httpClient.get<Municipio[]>(this.baseURL + path);
  }
}
