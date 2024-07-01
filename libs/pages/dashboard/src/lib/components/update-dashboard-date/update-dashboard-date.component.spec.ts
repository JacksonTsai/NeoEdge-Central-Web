import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateDashboardDateComponent } from './update-dashboard-date.component';

describe('UpdateDashboardDateComponent', () => {
  let component: UpdateDashboardDateComponent;
  let fixture: ComponentFixture<UpdateDashboardDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDashboardDateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateDashboardDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
