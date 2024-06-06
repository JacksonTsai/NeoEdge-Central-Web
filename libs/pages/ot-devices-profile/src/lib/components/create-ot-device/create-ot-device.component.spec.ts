import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOtDeviceComponent } from './create-ot-device.component';

describe('CreateOtDeviceComponent', () => {
  let component: CreateOtDeviceComponent;
  let fixture: ComponentFixture<CreateOtDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOtDeviceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOtDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
