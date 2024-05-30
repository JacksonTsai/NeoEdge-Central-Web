import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGatewayDialogComponent } from './add-gateway-dialog.component';

describe('AddGatewayDialogComponent', () => {
  let component: AddGatewayDialogComponent;
  let fixture: ComponentFixture<AddGatewayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGatewayDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGatewayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
