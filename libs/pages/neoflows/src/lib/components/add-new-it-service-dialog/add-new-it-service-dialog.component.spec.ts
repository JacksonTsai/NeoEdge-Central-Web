import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewItServiceDialogComponent } from './add-new-it-service-dialog.component';

describe('AddNewItServiceDialogComponent', () => {
  let component: AddNewItServiceDialogComponent;
  let fixture: ComponentFixture<AddNewItServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewItServiceDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewItServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
