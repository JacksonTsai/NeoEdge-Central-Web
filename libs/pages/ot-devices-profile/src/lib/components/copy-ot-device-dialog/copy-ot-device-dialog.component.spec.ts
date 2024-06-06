import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyOtDeviceDialogComponent } from './copy-ot-device-dialog.component';

describe('CopyOtDeviceDialogComponent', () => {
  let component: CopyOtDeviceDialogComponent;
  let fixture: ComponentFixture<CopyOtDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyOtDeviceDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CopyOtDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
