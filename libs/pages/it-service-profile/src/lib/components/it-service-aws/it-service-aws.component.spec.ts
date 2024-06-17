import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItServiceAwsComponent } from './it-service-aws.component';

describe('ItServiceAwsComponent', () => {
  let component: ItServiceAwsComponent;
  let fixture: ComponentFixture<ItServiceAwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItServiceAwsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItServiceAwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
