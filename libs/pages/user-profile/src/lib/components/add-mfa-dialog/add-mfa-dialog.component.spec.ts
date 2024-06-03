import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMfaDialogComponent } from './add-mfa-dialog.component';

describe('AddMfaDialogComponent', () => {
  let component: AddMfaDialogComponent;
  let fixture: ComponentFixture<AddMfaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMfaDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMfaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
