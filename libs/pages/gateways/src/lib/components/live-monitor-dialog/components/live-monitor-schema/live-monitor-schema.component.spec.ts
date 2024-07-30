import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveMonitorSchemaComponent } from './live-monitor-schema.component';

describe('LiveMonitorSchemaComponent', () => {
  let component: LiveMonitorSchemaComponent;
  let fixture: ComponentFixture<LiveMonitorSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMonitorSchemaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMonitorSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
