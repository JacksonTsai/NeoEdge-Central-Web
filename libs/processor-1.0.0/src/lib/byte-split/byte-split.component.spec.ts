import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ByteSplitComponent } from './byte-split.component';

describe('ByteSplitComponent', () => {
  let component: ByteSplitComponent;
  let fixture: ComponentFixture<ByteSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByteSplitComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ByteSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
