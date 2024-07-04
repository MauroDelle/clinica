import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearMedidas'
})
export class FormatearMedidasPipe implements PipeTransform {

  transform(value: any, key: any): any {
    if (key === 'temperatura' || key === 'peso' || key === 'altura') {
      return `${value} ${key == 'temperatura' ? '°C' : key == 'peso' ? 'KG' : 'cm'}`;
    }

    return value;
  }

}
