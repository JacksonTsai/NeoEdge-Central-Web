import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtDevicesPageComponent } from './ot-devices-page.component';

describe('OtDevicesPageComponent', () => {
  let component: OtDevicesPageComponent;
  let fixture: ComponentFixture<OtDevicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtDevicesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtDevicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
