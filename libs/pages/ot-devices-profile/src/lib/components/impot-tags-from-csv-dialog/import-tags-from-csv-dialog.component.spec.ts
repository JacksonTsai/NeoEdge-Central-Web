import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTagsFromCsvDialogComponent } from './import-tags-from-csv-dialog.component';

describe('ImportTagsFromCsvDialogComponent', () => {
  let component: ImportTagsFromCsvDialogComponent;
  let fixture: ComponentFixture<ImportTagsFromCsvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTagsFromCsvDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportTagsFromCsvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
