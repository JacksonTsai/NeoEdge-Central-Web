import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeoFlowsComponent } from './neoflows.component';

describe('NeoFlowsComponent', () => {
  let component: NeoFlowsComponent;
  let fixture: ComponentFixture<NeoFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoFlowsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
