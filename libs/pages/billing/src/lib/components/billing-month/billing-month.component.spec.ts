import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingMonthComponent } from './billing-month.component';

describe('BillingMonthComponent', () => {
  let component: BillingMonthComponent;
  let fixture: ComponentFixture<BillingMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingMonthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
