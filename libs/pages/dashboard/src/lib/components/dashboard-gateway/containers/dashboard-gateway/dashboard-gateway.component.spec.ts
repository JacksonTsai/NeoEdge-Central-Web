import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardGatewayComponent } from './dashboard-gateway.component';

describe('DashboardGatewayComponent', () => {
  let component: DashboardGatewayComponent;
  let fixture: ComponentFixture<DashboardGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGatewayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
