import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingTotalComponent } from './billing-total.component';

describe('BillingTotalComponent', () => {
  let component: BillingTotalComponent;
  let fixture: ComponentFixture<BillingTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingTotalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
