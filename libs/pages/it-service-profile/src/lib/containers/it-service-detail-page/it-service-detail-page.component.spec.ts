import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceDetailPageComponent } from './it-service-detail-page.component';

describe('ItServiceDetailPageComponent', () => {
  let component: ItServiceDetailPageComponent;
  let fixture: ComponentFixture<ItServiceDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceDetailPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
