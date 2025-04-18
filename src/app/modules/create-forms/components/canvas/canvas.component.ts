import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  
  // for changing of field title and description(placeholder)
  clearPlaceholder(field: 'formTitle' | 'formDescription', event: FocusEvent) {
    const element = event.target as HTMLElement;
    if (element.innerText.trim() === 'Form Title' || element.innerText.trim() === 'Form Description') {
      element.innerText = '';
    }
  }
  restorePlaceholder(field: 'formTitle' | 'formDescription', event: FocusEvent) {
    const element = event.target as HTMLElement;
    const text = element.innerText.trim();
    if (text === '') {
      element.innerText = this[field] === this.formTitle ? 'Form Title' : 'Form Description'; // reset placeholder
    } else {
      this[field] = text; // save typed content
    }
  }
}
