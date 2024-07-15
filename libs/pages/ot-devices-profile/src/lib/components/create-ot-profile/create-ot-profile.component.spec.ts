import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOtProfileComponent } from './create-ot-profile.component';

describe('CreateOtProfileComponent', () => {
  let component: CreateOtProfileComponent;
  let fixture: ComponentFixture<CreateOtProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOtProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOtProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
