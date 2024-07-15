import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMessageDestinationComponent } from './select-message-destination.component';

describe('SelectMessageDestinationComponent', () => {
  let component: SelectMessageDestinationComponent;
  let fixture: ComponentFixture<SelectMessageDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMessageDestinationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMessageDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
