import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorCpuComponent } from './live-monitor-cpu.component';

describe('LiveMonitorCpuComponent', () => {
  let component: LiveMonitorCpuComponent;
  let fixture: ComponentFixture<LiveMonitorCpuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorCpuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorCpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
