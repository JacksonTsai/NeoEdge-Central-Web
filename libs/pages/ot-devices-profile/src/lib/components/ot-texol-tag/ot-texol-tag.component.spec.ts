import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtTexolTagComponent } from './ot-texol-tag.component';

describe('OtTexolTagComponent', () => {
  let component: OtTexolTagComponent;
  let fixture: ComponentFixture<OtTexolTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtTexolTagComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtTexolTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
