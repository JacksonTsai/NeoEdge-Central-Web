import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeUploadFileComponent } from './ne-upload-file.component';

describe('NeUploadFileComponent', () => {
  let component: NeUploadFileComponent;
  let fixture: ComponentFixture<NeUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeUploadFileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
