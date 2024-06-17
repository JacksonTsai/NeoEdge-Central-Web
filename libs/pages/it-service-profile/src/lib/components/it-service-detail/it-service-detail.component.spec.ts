import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceDetailComponent } from './it-service-detail.component';

describe('ItServiceDetailComponent', () => {
  let component: ItServiceDetailComponent;
  let fixture: ComponentFixture<ItServiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
