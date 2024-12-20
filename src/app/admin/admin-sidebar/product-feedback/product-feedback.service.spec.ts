import { TestBed } from '@angular/core/testing';

import { ProductFeedbackService } from './product-feedback.service';

describe('ProductFeedbackService', () => {
  let service: ProductFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
