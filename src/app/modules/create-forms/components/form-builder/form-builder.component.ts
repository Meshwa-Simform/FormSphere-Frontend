import { Component, Input } from '@angular/core';
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
  isPreviewMode = false; 
  @Input() formTitle = 'Form Title';
  @Input() formDescription = 'Form Description';
  @Input() logoUrl: string | null = null; // URL for the logo image
  
  onPreviewToggle() {
    this.isPreviewMode = !this.isPreviewMode;
  }

  canvasStyling: Partial<Styling> = {};
  rawTheme: Styling = {
    pageColor: '#c2dfff',
    formColor: '#fff',
    fontColor: '#01458e',
    fontFamily: 'Inter',
    fontSize: 16,
  };
  selectedElement: Element | null = null;
  elements: Element[] = [];

  onCanvasStylingChange(style: Styling) {
    // Ensure all required properties are set
    this.rawTheme = {
      pageColor: style.pageColor ?? '#c2dfff',
      formColor: style.formColor ?? '#fff',
      fontColor: style.fontColor ?? '#01458e',
      fontFamily: style.fontFamily ?? 'Inter',
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
