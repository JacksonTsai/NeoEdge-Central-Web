import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteGatewayConfirmDialogComponent } from './delete-gateway-confirm-dialog.component';

describe('DeleteGatewayConfirmComponent', () => {
  let component: DeleteGatewayConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteGatewayConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGatewayConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGatewayConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
