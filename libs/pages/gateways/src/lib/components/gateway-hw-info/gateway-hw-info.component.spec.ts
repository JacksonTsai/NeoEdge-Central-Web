import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayHwInfoComponent } from './gateway-hw-info.component';

describe('GatewayHwInfoComponent', () => {
  let component: GatewayHwInfoComponent;
  let fixture: ComponentFixture<GatewayHwInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayHwInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayHwInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
