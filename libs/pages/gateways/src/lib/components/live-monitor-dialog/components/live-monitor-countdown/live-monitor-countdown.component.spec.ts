import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorCountdownComponent } from './live-monitor-countdown.component';

describe('LiveMonitorCountdownComponent', () => {
  let component: LiveMonitorCountdownComponent;
  let fixture: ComponentFixture<LiveMonitorCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorCountdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
