import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNeoflowPageComponent } from './create-neoflow-page.component';

describe('CreateNeoflowPageComponent', () => {
  let component: CreateNeoflowPageComponent;
  let fixture: ComponentFixture<CreateNeoflowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNeoflowPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNeoflowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
