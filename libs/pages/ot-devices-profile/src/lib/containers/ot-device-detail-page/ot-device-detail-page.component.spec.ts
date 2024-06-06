import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtDeviceDetailPageComponent } from './ot-device-detail-page.component';

describe('OtDeviceDetailPageComponent', () => {
  let component: OtDeviceDetailPageComponent;
  let fixture: ComponentFixture<OtDeviceDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtDeviceDetailPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtDeviceDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
