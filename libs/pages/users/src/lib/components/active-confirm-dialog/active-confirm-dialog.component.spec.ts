import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveConfirmDialogComponent } from './active-confirm-dialog.component';

describe('ActiveConfirmDialogComponent', () => {
  let component: ActiveConfirmDialogComponent;
  let fixture: ComponentFixture<ActiveConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
