import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModbusRtuProfileComponent } from './modbus-rtu-profile.component';

describe('ModbusRtuProfileComponent', () => {
  let component: ModbusRtuProfileComponent;
  let fixture: ComponentFixture<ModbusRtuProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModbusRtuProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModbusRtuProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
