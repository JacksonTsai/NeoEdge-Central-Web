import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteOtDeviceConfirmDialogComponent } from './delete-ot-device-confirm-dialog.component';

describe('DeleteOtDeviceConfirmDialogComponent', () => {
  let component: DeleteOtDeviceConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteOtDeviceConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOtDeviceConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteOtDeviceConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
