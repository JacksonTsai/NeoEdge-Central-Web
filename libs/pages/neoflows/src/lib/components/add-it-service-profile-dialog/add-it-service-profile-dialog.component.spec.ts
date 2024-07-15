import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItServiceProfileDialogComponent } from './add-it-service-profile-dialog.component';

describe('AddItServiceProfileDialogComponent', () => {
  let component: AddItServiceProfileDialogComponent;
  let fixture: ComponentFixture<AddItServiceProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItServiceProfileDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItServiceProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
