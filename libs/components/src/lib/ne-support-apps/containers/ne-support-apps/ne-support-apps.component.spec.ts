import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeSupportAppsComponent } from './ne-support-apps.component';

describe('NeSupportAppsComponent', () => {
  let component: NeSupportAppsComponent;
  let fixture: ComponentFixture<NeSupportAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeSupportAppsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeSupportAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
