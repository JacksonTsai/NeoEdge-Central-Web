import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailNeoflowPageComponent } from './detail-neoflow-page.component';

describe('DetailNeoflowPageComponent', () => {
  let component: DetailNeoflowPageComponent;
  let fixture: ComponentFixture<DetailNeoflowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailNeoflowPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailNeoflowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
