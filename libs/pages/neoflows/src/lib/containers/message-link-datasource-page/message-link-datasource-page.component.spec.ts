import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageLinkDatasourcePageComponent } from './message-link-datasource-page.component';

describe('MessageLinkDatasourcePageComponent', () => {
  let component: MessageLinkDatasourcePageComponent;
  let fixture: ComponentFixture<MessageLinkDatasourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLinkDatasourcePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLinkDatasourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
