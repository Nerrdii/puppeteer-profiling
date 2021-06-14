import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-lighthouse-report',
  templateUrl: './lighthouse-report.component.html',
  styleUrls: ['./lighthouse-report.component.css'],
})
export class LighthouseReportComponent implements OnInit, OnDestroy {
  public value = 0;
  private subscriptions: Subscription[] = [];

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    // Comment this out to improve performance for lighthouse report
    for (let i = 0; i < 1000; i++) {
      this.subscriptions.push(
        this.appService.getValue().subscribe((value) => {
          this.value = value;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
