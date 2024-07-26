import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionUnitComponent } from './addition-unit.component';

describe('AdditionUnitComponent', () => {
  let component: AdditionUnitComponent;
  let fixture: ComponentFixture<AdditionUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionUnitComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
