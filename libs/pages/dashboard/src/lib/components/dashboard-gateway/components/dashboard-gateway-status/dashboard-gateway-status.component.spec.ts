import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardGatewayStatusComponent } from './dashboard-gateway-status.component';

describe('DashboardGatewayStatusComponent', () => {
  let component: DashboardGatewayStatusComponent;
  let fixture: ComponentFixture<DashboardGatewayStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGatewayStatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardGatewayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
