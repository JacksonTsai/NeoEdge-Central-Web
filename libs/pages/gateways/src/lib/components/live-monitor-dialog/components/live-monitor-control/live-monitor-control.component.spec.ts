import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorControlComponent } from './live-monitor-control.component';

describe('LiveMonitorControlComponent', () => {
  let component: LiveMonitorControlComponent;
  let fixture: ComponentFixture<LiveMonitorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorControlComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
