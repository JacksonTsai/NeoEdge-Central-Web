import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtDeviceProfileComponent } from './ot-device-profile.component';

describe('OtDeviceProfileComponent', () => {
  let component: OtDeviceProfileComponent;
  let fixture: ComponentFixture<OtDeviceProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtDeviceProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtDeviceProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
