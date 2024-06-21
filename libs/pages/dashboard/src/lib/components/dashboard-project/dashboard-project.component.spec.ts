import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardProjectDetailComponent } from './dashboard-project-detail.component';

describe('DashboardProjectDetailComponent', () => {
  let component: DashboardProjectDetailComponent;
  let fixture: ComponentFixture<DashboardProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProjectDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
