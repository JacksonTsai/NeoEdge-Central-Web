import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageSettingComponent } from './message-setting.component';

describe('AddMessageFromDeviceDialogComponent', () => {
  let component: MessageSettingComponent;
  let fixture: ComponentFixture<MessageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSettingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
