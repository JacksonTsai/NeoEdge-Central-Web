import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceComponent } from './it-services.component';

describe('ItServiceComponent', () => {
  let component: ItServiceComponent;
  let fixture: ComponentFixture<ItServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
