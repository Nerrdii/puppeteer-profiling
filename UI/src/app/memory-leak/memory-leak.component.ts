import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-memory-leak',
  templateUrl: './memory-leak.component.html',
  styleUrls: ['./memory-leak.component.css'],
})
export class MemoryLeakComponent implements OnInit, OnDestroy {
  public value = 0;
  private subscriptions: Subscription[] = [];

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    // Comment this out to improve performance for lighthouse report
    // for (let i = 0; i < 1000; i++) {
    //   this.subscriptions.push(
    //     this.appService.getValue().subscribe((value) => {
    //       this.value = value;
    //     })
    //   );
    // }
  }

  ngOnDestroy(): void {
    // Comment this line out to create memory leak
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
