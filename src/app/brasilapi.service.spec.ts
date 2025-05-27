import { TestBed } from '@angular/core/testing';

import { BrasilapiService } from './brasilapi.service';
import { HttpClientModule } from '@angular/common/http';

describe('BrasilapiService', () => {
  let service: BrasilapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [HttpClientModule],
    });
    service = TestBed.inject(BrasilapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
