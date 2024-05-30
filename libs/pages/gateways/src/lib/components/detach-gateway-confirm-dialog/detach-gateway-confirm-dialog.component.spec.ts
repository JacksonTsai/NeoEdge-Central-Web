import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetachGatewayConfirmDialogComponent } from './detach-gateway-confirm-dialog.component';

describe('DetachGatewayConfirmDialogComponent', () => {
  let component: DetachGatewayConfirmDialogComponent;
  let fixture: ComponentFixture<DetachGatewayConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetachGatewayConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetachGatewayConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
