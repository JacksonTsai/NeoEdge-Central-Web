import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayNeoedgxComponent } from './gateway-neoedgx.component';

describe('GatewayNeoedgxComponent', () => {
  let component: GatewayNeoedgxComponent;
  let fixture: ComponentFixture<GatewayNeoedgxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayNeoedgxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayNeoedgxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
