import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMessageSchemaComponent } from './create-message-schema.component';

describe('CreateMessageSchemaComponent', () => {
  let component: CreateMessageSchemaComponent;
  let fixture: ComponentFixture<CreateMessageSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMessageSchemaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMessageSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
