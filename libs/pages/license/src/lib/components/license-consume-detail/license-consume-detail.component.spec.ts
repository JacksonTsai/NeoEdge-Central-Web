import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicenseConsumeDetailComponent } from './license-consume-detail.component';

describe('LicenseConsumeDetailComponent', () => {
  let component: LicenseConsumeDetailComponent;
  let fixture: ComponentFixture<LicenseConsumeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseConsumeDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseConsumeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
