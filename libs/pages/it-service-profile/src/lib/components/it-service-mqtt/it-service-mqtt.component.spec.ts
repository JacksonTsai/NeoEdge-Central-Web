import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceMqttComponent } from './it-service-mqtt.component';

describe('ItServiceMqttComponent', () => {
  let component: ItServiceMqttComponent;
  let fixture: ComponentFixture<ItServiceMqttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceMqttComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceMqttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
