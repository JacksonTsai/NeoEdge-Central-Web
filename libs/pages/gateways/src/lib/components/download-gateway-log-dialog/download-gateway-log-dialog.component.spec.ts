import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadGatewayLogDialogComponent } from './download-gateway-log-dialog.component';

describe('DownloadGatewayLogDialogComponent', () => {
  let component: DownloadGatewayLogDialogComponent;
  let fixture: ComponentFixture<DownloadGatewayLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadGatewayLogDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadGatewayLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
