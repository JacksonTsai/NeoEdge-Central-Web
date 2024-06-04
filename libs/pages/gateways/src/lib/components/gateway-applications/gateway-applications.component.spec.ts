import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayApplicationsComponent } from './gateway-applications.component';

describe('GatewayNeoedgxComponent', () => {
  let component: GatewayApplicationsComponent;
  let fixture: ComponentFixture<GatewayApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayApplicationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
