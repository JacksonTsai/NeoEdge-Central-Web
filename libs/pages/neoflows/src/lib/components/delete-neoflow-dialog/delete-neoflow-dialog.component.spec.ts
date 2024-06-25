import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteNeoflowDialogComponent } from './delete-neoflow-dialog.component';

describe('DeleteNeoflowDialogComponent', () => {
  let component: DeleteNeoflowDialogComponent;
  let fixture: ComponentFixture<DeleteNeoflowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNeoflowDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteNeoflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
