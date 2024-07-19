import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TumblingWindowComponent } from './tumbling-window.component';

describe('TumblingWindowComponent', () => {
  let component: TumblingWindowComponent;
  let fixture: ComponentFixture<TumblingWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TumblingWindowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TumblingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
