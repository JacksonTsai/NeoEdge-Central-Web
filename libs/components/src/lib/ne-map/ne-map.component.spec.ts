import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeMapComponent } from './ne-map.component';

describe('NeMapComponent', () => {
  let component: NeMapComponent;
  let fixture: ComponentFixture<NeMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeMapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
