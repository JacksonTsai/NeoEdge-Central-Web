import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLicenseComponent } from './dashboard-license.component';

describe('DashboardLicenseComponent', () => {
  let component: DashboardLicenseComponent;
  let fixture: ComponentFixture<DashboardLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLicenseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
