import { Component,Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-pipes',
  standalone: false,
  templateUrl: './pipes.html',
  styleUrl: './pipes.css'
})
export class Pipes { }

@Pipe({
  name: 'propercase',
  standalone: true 
})
export class ProperCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Normalize spaces: remove extra spaces
    value = value.replace(/\s+/g, ' ').trim();

    // Capitalize first letter of each word
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}