import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayNeoflowComponent } from './gateway-neoflow.component';

describe('GatewayNeoflowComponent', () => {
  let component: GatewayNeoflowComponent;
  let fixture: ComponentFixture<GatewayNeoflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayNeoflowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayNeoflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
