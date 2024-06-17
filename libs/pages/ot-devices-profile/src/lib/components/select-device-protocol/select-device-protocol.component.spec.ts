import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDeviceProtocolComponent } from './select-device-protocol.component';

describe('CreateOtDeviceComponent', () => {
  let component: SelectDeviceProtocolComponent;
  let fixture: ComponentFixture<SelectDeviceProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDeviceProtocolComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDeviceProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
