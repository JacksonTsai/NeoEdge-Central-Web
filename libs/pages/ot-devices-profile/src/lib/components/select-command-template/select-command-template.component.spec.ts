import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCommandTemplateComponent } from './select-command-template.component';

describe('SelectCommandTemplateComponent', () => {
  let component: SelectCommandTemplateComponent;
  let fixture: ComponentFixture<SelectCommandTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCommandTemplateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCommandTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
