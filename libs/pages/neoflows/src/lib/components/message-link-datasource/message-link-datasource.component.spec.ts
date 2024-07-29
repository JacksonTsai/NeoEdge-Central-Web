import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageLinkDataSourceComponent } from './message-link-datasource.component';

describe('MessageLinkDatasourceComponent', () => {
  let component: MessageLinkDataSourceComponent;
  let fixture: ComponentFixture<MessageLinkDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLinkDataSourceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLinkDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
