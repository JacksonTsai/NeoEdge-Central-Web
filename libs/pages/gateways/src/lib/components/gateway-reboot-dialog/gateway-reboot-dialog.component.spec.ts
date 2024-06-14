import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayRebootDialogComponent } from './gateway-reboot-dialog.component';

describe('GatewayRebootDialogComponent', () => {
  let component: GatewayRebootDialogComponent;
  let fixture: ComponentFixture<GatewayRebootDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayRebootDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayRebootDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
