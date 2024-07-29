import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathCalculatorComponent } from './math-calculator.component';

describe('MathCalculatorComponent', () => {
  let component: MathCalculatorComponent;
  let fixture: ComponentFixture<MathCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathCalculatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MathCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
