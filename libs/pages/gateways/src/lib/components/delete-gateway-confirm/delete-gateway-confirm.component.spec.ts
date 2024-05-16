import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteGatewayConfirmComponent } from './delete-gateway-confirm.component';

describe('DeleteGatewayConfirmComponent', () => {
  let component: DeleteGatewayConfirmComponent;
  let fixture: ComponentFixture<DeleteGatewayConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGatewayConfirmComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGatewayConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
