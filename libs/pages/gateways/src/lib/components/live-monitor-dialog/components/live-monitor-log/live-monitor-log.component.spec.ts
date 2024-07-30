import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorLogComponent } from './live-monitor-log.component';

describe('LiveMonitorLogComponent', () => {
  let component: LiveMonitorLogComponent;
  let fixture: ComponentFixture<LiveMonitorLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorLogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
