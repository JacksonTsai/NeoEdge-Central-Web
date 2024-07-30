import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorStatusItemComponent } from './live-monitor-status-item.component';

describe('LiveMonitorStatusItemComponent', () => {
  let component: LiveMonitorStatusItemComponent;
  let fixture: ComponentFixture<LiveMonitorStatusItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorStatusItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorStatusItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
