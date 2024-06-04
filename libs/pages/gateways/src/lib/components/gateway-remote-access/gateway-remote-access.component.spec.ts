import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayRemoteAccessComponent } from './gateway-remote-access.component';

describe('GatewayRemoteAccessComponent', () => {
  let component: GatewayRemoteAccessComponent;
  let fixture: ComponentFixture<GatewayRemoteAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayRemoteAccessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
