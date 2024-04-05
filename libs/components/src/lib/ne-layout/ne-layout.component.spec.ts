import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeLayoutComponent } from './ne-layout.component';

describe('NeLayoutComponent', () => {
  let component: NeLayoutComponent;
  let fixture: ComponentFixture<NeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
