import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOtDeviceProfileDialogComponent } from './add-ot-device-profile-dialog.component';

describe('AddOtDeviceProfileDialogComponent', () => {
  let component: AddOtDeviceProfileDialogComponent;
  let fixture: ComponentFixture<AddOtDeviceProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOtDeviceProfileDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOtDeviceProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
