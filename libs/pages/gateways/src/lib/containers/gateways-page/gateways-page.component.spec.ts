import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewaysPageComponent } from './gateways-page.component';

describe('GatewaysPageComponent', () => {
  let component: GatewaysPageComponent;
  let fixture: ComponentFixture<GatewaysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewaysPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
