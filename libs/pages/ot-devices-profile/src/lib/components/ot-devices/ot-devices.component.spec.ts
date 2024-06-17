import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtDevicesComponent } from './ot-devices.component';

describe('OtDeviceProfileComponent', () => {
  let component: OtDevicesComponent;
  let fixture: ComponentFixture<OtDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtDevicesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
