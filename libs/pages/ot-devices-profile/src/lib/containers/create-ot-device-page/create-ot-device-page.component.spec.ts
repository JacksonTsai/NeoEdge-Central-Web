import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOtDevicePageComponent } from './create-ot-device-page.component';

describe('CreateOtDevicePageComponent', () => {
  let component: CreateOtDevicePageComponent;
  let fixture: ComponentFixture<CreateOtDevicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOtDevicePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOtDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
