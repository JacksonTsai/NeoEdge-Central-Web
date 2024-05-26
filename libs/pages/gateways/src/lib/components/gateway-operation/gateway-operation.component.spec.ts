import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayOperationComponent } from './gateway-operation.component';
describe('GatewayOperationComponent', () => {
  let component: GatewayOperationComponent;
  let fixture: ComponentFixture<GatewayOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayOperationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
