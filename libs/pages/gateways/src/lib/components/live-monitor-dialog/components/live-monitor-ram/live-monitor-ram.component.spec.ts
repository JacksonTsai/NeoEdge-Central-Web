import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorRamComponent } from './live-monitor-ram.component';

describe('LiveMonitorRamComponent', () => {
  let component: LiveMonitorRamComponent;
  let fixture: ComponentFixture<LiveMonitorRamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorRamComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorRamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
