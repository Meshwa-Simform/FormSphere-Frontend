import { Component } from '@angular/core';
import { Styling } from '../../interface/form'; // Import the correct Styling interface
import { Element } from '../../interface/element'; // Import your Element interface

@Component({
  selector: 'app-form-builder',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css',
})
export class FormBuilderComponent {
  canvasStyling: Partial<Styling> = {};
  rawTheme: Styling = {
    pageColor: '#f8f9fa',
    formColor: '#fff',
    fontColor: '#000',
    fontFamily: 'Montserrat',
    fontSize: 16,
  };
  selectedElement: Element | null = null;
  elements: Element[] = [];

  onCanvasStylingChange(style: Styling) {
    // Ensure all required properties are set
    this.rawTheme = {
      pageColor: style.pageColor ?? '#f8f9fa',
      formColor: style.formColor ?? '#fff',
      fontColor: style.fontColor ?? '#000',
      fontFamily: style.fontFamily ?? 'Montserrat',
      fontSize: style.fontSize ?? 16,
      ...(style.pageImage ? { pageImage: style.pageImage } : {}),
    };
    this.canvasStyling = {
      pageColor: this.rawTheme.pageColor,
      fontColor: this.rawTheme.fontColor,
      fontFamily: this.rawTheme.fontFamily,
      fontSize: this.rawTheme.fontSize,
    };
  }

  // Add a handler to receive selection from canvas
  onElementSelected(element: Element | null) {
    this.selectedElement = element;
  }
  
  // Add a handler to receive elements from canvas
  onElementsChanged(elements: Element[]) {
    this.elements = elements;
  }

  
}
