import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayProfileComponent } from './gateway-profile.component';

describe('GatewayProfileComponent', () => {
  let component: GatewayProfileComponent;
  let fixture: ComponentFixture<GatewayProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
