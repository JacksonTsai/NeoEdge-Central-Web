import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteItServiceDialogComponent } from './delete-it-service-dialog.component';

describe('DeleteItServiceDialogComponent', () => {
  let component: DeleteItServiceDialogComponent;
  let fixture: ComponentFixture<DeleteItServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteItServiceDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteItServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
