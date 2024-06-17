import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceAzureComponent } from './it-service-azure.component';

describe('ItServiceAzureComponent', () => {
  let component: ItServiceAzureComponent;
  let fixture: ComponentFixture<ItServiceAzureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceAzureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceAzureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
