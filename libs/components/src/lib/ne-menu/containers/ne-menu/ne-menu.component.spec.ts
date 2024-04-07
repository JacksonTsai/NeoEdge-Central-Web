import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeMenuComponent } from './ne-menu.component';

describe('NeMenuComponent', () => {
  let component: NeMenuComponent;
  let fixture: ComponentFixture<NeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
