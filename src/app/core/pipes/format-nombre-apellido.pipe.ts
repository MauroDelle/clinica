import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNombreApellido'
})
export class FormatNombreApellidoPipe implements PipeTransform {

  transform(nombre: string, apellido: string): string {
    // Check if both nombre and apellido are provided
    if (nombre && apellido) {
      return `${apellido}, ${nombre}`;
    }

    // If either nombre or apellido is missing, return the original value
    return nombre || apellido || '';
  }

}
