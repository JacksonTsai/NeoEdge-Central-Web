import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageLinkDatasourceComponent } from './message-link-datasource.component';

describe('MessageLinkDatasourceComponent', () => {
  let component: MessageLinkDatasourceComponent;
  let fixture: ComponentFixture<MessageLinkDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLinkDatasourceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLinkDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
