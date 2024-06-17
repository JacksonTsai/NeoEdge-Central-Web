import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModbusTcpProfileComponent } from './modbus-tcp-profile.component';

describe('ModbusTcpProfileComponent', () => {
  let component: ModbusTcpProfileComponent;
  let fixture: ComponentFixture<ModbusTcpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModbusTcpProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModbusTcpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
