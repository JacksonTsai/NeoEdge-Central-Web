import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageLinkDestinationPageComponent } from './message-link-destination-page.component';

describe('MessageLinkDestinationPageComponent', () => {
  let component: MessageLinkDestinationPageComponent;
  let fixture: ComponentFixture<MessageLinkDestinationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLinkDestinationPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLinkDestinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
