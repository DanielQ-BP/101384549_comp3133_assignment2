import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true,
})
export class InitialsPipe implements PipeTransform {
  transform(firstName: string, lastName: string): string {
    const f = firstName?.charAt(0) ?? '';
    const l = lastName?.charAt(0) ?? '';
    return (f + l).toUpperCase();
  }
}
