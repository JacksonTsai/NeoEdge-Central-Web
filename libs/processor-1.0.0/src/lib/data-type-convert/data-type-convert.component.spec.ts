import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTypeConvertComponent } from './data-type-convert.component';

describe('DataTypeConvertComponent', () => {
  let component: DataTypeConvertComponent;
  let fixture: ComponentFixture<DataTypeConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTypeConvertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTypeConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
