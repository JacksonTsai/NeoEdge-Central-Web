import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingDownloadComponent } from './billing-download.component';

describe('BillingDownloadComponent', () => {
  let component: BillingDownloadComponent;
  let fixture: ComponentFixture<BillingDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingDownloadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
