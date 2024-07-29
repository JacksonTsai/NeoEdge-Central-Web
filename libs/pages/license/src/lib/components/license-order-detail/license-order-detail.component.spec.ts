import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicenseOrderDetailComponent } from './license-order-detail.component';

describe('LicenseOrderDetailComponent', () => {
  let component: LicenseOrderDetailComponent;
  let fixture: ComponentFixture<LicenseOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseOrderDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
