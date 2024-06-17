import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServicePageComponent } from './it-service-page.component';

describe('ItServicePageComponent', () => {
  let component: ItServicePageComponent;
  let fixture: ComponentFixture<ItServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServicePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
