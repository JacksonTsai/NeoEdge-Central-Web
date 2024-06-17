import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtTagsComponent } from './ot-tags.component';

describe('OtTagsComponent', () => {
  let component: OtTagsComponent;
  let fixture: ComponentFixture<OtTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtTagsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
