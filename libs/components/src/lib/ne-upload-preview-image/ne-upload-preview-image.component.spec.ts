import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeUploadPreviewImageComponent } from './ne-upload-preview-image.component';

describe('NeUploadPreviewImageComponent', () => {
  let component: NeUploadPreviewImageComponent;
  let fixture: ComponentFixture<NeUploadPreviewImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeUploadPreviewImageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeUploadPreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
