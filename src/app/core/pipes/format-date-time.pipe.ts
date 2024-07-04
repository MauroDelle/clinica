import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatTimestamp'
})
export class FormatTimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
    );
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
}
