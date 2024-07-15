import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDataProviderComponent } from './select-data-provider.component';

describe('SelectDataProviderComponent', () => {
  let component: SelectDataProviderComponent;
  let fixture: ComponentFixture<SelectDataProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDataProviderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDataProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
