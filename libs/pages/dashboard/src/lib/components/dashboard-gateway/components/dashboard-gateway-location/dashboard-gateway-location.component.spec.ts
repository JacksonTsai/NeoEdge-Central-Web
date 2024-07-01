import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardGatewayLocationComponent } from './dashboard-gateway-location.component';

describe('DashboardGatewayLocationComponent', () => {
  let component: DashboardGatewayLocationComponent;
  let fixture: ComponentFixture<DashboardGatewayLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGatewayLocationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardGatewayLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
