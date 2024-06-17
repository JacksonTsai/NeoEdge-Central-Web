import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateItServiceComponent } from './create-it-service.component';

describe('CreateItServiceComponent', () => {
  let component: CreateItServiceComponent;
  let fixture: ComponentFixture<CreateItServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItServiceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateItServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
