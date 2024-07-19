import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeExpansionTableComponent } from './ne-expansion-table.component';

describe('NeExpansionTableComponent', () => {
  let component: NeExpansionTableComponent;
  let fixture: ComponentFixture<NeExpansionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeExpansionTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeExpansionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
