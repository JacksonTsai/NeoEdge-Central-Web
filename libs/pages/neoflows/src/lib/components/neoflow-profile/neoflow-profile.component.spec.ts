import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeoflowProfileComponent } from './neoflow-profile.component';

describe('NeoflowProfileComponent', () => {
  let component: NeoflowProfileComponent;
  let fixture: ComponentFixture<NeoflowProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoflowProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoflowProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
