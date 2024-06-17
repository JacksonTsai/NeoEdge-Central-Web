import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeSupportAppItemComponent } from './ne-support-app-item.component';

describe('NeSupportAppItemComponent', () => {
  let component: NeSupportAppItemComponent;
  let fixture: ComponentFixture<NeSupportAppItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeSupportAppItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeSupportAppItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
