import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeMultiSelectChipsComponent } from './ne-multi-select-chips.component';

describe('NeMultiSelectChipsComponent', () => {
  let component: NeMultiSelectChipsComponent;
  let fixture: ComponentFixture<NeMultiSelectChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeMultiSelectChipsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeMultiSelectChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
