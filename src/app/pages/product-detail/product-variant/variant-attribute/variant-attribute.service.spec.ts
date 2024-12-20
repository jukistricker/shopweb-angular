import { TestBed } from '@angular/core/testing';

import { VariantAttributeService } from './variant-attribute.service';

describe('VariantAttributeService', () => {
  let service: VariantAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
