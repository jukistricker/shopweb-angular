import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantAttributeComponent } from './variant-attribute.component';

describe('VariantAttributeComponent', () => {
  let component: VariantAttributeComponent;
  let fixture: ComponentFixture<VariantAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
