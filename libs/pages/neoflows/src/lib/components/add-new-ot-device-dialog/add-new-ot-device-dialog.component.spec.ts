import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewOtDeviceDialogComponent } from './add-new-ot-device-dialog.component';

describe('AddNewOtDeviceDialogComponent', () => {
  let component: AddNewOtDeviceDialogComponent;
  let fixture: ComponentFixture<AddNewOtDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewOtDeviceDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewOtDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
