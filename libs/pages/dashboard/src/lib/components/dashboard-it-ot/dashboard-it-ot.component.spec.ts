import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardItOtComponent } from './dashboard-it-ot.component';

describe('DashboardItOtComponent', () => {
  let component: DashboardItOtComponent;
  let fixture: ComponentFixture<DashboardItOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItOtComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardItOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
