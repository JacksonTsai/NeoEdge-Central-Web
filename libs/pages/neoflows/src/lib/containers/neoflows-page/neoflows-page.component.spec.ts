import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeoflowsPageComponent } from './neoflows-page.component';

describe('NeoflowsPageComponent', () => {
  let component: NeoflowsPageComponent;
  let fixture: ComponentFixture<NeoflowsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoflowsPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoflowsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
