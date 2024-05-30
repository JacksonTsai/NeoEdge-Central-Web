import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayMetaDataComponent } from './gateway-meta-data.component';

describe('GatewayMetaDataComponent', () => {
  let component: GatewayMetaDataComponent;
  let fixture: ComponentFixture<GatewayMetaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayMetaDataComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GatewayMetaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
