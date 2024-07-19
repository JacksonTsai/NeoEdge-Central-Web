import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IfActionComponent } from './if-action.component';

describe('IfActionComponent', () => {
  let component: IfActionComponent;
  let fixture: ComponentFixture<IfActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfActionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IfActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
