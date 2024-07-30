import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorStatusComponent } from './live-monitor-status.component';

describe('LiveMonitorStatusComponent', () => {
  let component: LiveMonitorStatusComponent;
  let fixture: ComponentFixture<LiveMonitorStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorStatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
