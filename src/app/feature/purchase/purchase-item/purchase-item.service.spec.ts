import { TestBed } from '@angular/core/testing';

import { PurchaseItemService } from './purchase-item.service';

describe('PurchaseItemService', () => {
  let service: PurchaseItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
