import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendMfaAppComponent } from './recommend-mfa-app.component';

describe('RecommendMfaAppComponent', () => {
  let component: RecommendMfaAppComponent;
  let fixture: ComponentFixture<RecommendMfaAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendMfaAppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendMfaAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
