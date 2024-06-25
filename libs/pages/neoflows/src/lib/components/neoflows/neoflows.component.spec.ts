import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeoflowsComponent } from './neoflows.component';

describe('NeoflowsComponent', () => {
  let component: NeoflowsComponent;
  let fixture: ComponentFixture<NeoflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoflowsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
