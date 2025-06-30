import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Styling } from '../../interface/form';

@Component({
  selector: 'app-stylebar',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './stylebar.component.html',
  styleUrl: './stylebar.component.css'
})
export class StylebarComponent implements OnChanges, OnInit {
  isStylebarOpen = false;

  // Font options array
  fontOptions: string[] = ["Roboto", "Open Sans", "Montserrat", "Oswald", "Raleway", "Poppins", "Merriweather", "Work Sans", "Nunito", "Helvetica", "Inter", "PT Sans", "Rubik", "Quicksand", "Segoe UI"];

  // Default font is Montserrat
  @Input() theme: Styling = {
    pageColor: '#f8f9fa',
    formColor: '#ffffff',
    fontColor: '#000000',
    fontFamily: 'Montserrat',
    fontSize: 16
  };

  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;
  @Output() styleChange = new EventEmitter<{ css: Record<string, string>, theme: Styling }>();

  toggleStylebar(): void {
    this.isStylebarOpen = !this.isStylebarOpen;
  }

  ngOnInit() {
    this.emitStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['theme'] && changes['theme'].currentValue) {
      this.theme = { ...changes['theme'].currentValue };
      this.emitStyle();
    }
  }

  emitStyle() {
    this.styleChange.emit({
      css: {
        backgroundColor: this.theme.pageColor,
        color: this.theme.fontColor,
        fontFamily: this.theme.fontFamily,
        fontSize: this.theme.fontSize
          ? typeof this.theme.fontSize === 'number'
            ? `${this.theme.fontSize}px`
            : this.theme.fontSize
          : '16px'
      },
      theme: { ...this.theme }
    });
  }

  // Watch for changes and emit
  onThemeChange() {
    this.emitStyle();
  }

}
