import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeMenuTreeComponent } from './ne-menu-tree.component';

describe('NeMenuTreeComponent', () => {
  let component: NeMenuTreeComponent;
  let fixture: ComponentFixture<NeMenuTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeMenuTreeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeMenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
