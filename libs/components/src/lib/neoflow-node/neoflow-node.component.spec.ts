import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeoFlowNodeComponent } from './neoflow-node.component';

describe('NeoFlowNodeComponent', () => {
  let component: NeoFlowNodeComponent;
  let fixture: ComponentFixture<NeoFlowNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoFlowNodeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoFlowNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
