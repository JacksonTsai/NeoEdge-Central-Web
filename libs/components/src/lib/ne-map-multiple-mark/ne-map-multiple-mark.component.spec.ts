import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeMapMultipleMarkComponent } from './ne-map-multiple-mark.component';

describe('NeMapMultipleMarkComponent', () => {
  let component: NeMapMultipleMarkComponent;
  let fixture: ComponentFixture<NeMapMultipleMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeMapMultipleMarkComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeMapMultipleMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
