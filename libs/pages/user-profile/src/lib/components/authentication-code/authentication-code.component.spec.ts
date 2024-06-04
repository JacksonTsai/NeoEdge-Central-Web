import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationCodeComponent } from './authentication-code.component';

describe('AuthenticationCodeComponent', () => {
  let component: AuthenticationCodeComponent;
  let fixture: ComponentFixture<AuthenticationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationCodeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
