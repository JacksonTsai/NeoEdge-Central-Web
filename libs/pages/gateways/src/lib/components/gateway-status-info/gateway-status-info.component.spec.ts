import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayStatusInfoComponent } from './gateway-status-info.component';

describe('GatewayStatusInfoComponent', () => {
  let component: GatewayStatusInfoComponent;
  let fixture: ComponentFixture<GatewayStatusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayStatusInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayStatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
