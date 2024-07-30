import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorDialogComponent } from './live-monitor-dialog.component';

describe('LiveMonitorDialogComponent', () => {
  let component: LiveMonitorDialogComponent;
  let fixture: ComponentFixture<LiveMonitorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
