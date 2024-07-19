import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicenseOrdersComponent } from './license-orders.component';

describe('LicenseOrdersComponent', () => {
  let component: LicenseOrdersComponent;
  let fixture: ComponentFixture<LicenseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseOrdersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
