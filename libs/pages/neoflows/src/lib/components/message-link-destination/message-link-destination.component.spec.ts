import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageLinkDestinationComponent } from './message-link-destination.component';

describe('MessageLinkDestinationComponent', () => {
  let component: MessageLinkDestinationComponent;
  let fixture: ComponentFixture<MessageLinkDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLinkDestinationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLinkDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
