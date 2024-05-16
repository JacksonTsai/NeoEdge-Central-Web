import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayLogComponent } from './gateway-log.component';

describe('GatewayLogComponent', () => {
  let component: GatewayLogComponent;
  let fixture: ComponentFixture<GatewayLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayLogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
