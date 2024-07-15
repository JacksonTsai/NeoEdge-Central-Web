import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtDeviceDetailDialogComponent } from './ot-device-detail-dialog.component';

describe('OtDevcieDetailDialogComponent', () => {
  let component: OtDeviceDetailDialogComponent;
  let fixture: ComponentFixture<OtDeviceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtDeviceDetailDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtDeviceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
