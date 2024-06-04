import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangeLabelDialogComponent } from './mange-label-dialog.component';

describe('MangeLabelDialogComponent', () => {
  let component: MangeLabelDialogComponent;
  let fixture: ComponentFixture<MangeLabelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangeLabelDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MangeLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
