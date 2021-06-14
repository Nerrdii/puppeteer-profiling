import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LighthouseReportComponent } from './lighthouse-report.component';

describe('LighthouseReportComponent', () => {
  let component: LighthouseReportComponent;
  let fixture: ComponentFixture<LighthouseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LighthouseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LighthouseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
