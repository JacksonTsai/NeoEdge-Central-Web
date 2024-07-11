import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardBillingComponent } from './dashboard-billing.component';

describe('DashboardBillingComponent', () => {
  let component: DashboardBillingComponent;
  let fixture: ComponentFixture<DashboardBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBillingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
