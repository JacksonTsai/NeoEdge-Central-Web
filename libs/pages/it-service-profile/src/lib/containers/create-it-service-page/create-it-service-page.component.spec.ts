import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateItServicePageComponent } from './create-it-service-page.component';

describe('CreateItServicePageComponent', () => {
  let component: CreateItServicePageComponent;
  let fixture: ComponentFixture<CreateItServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItServicePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateItServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
