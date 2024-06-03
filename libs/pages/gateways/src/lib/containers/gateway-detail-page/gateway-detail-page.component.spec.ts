import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayDetailPageComponent } from './gateway-detail-page.component';

describe('GatewayDetailPageComponent', () => {
  let component: GatewayDetailPageComponent;
  let fixture: ComponentFixture<GatewayDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayDetailPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
