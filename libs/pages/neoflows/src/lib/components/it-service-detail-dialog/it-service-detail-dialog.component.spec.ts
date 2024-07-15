import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceDetailDialogComponent } from './it-service-detail-dialog.component';

describe('ItServiceDetailDialogComponent', () => {
  let component: ItServiceDetailDialogComponent;
  let fixture: ComponentFixture<ItServiceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceDetailDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
