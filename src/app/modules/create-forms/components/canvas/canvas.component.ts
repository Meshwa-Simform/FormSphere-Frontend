import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilderService } from '../../../../services/formbuilder/form-builder.service';
import { Element } from '../../interface/element';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-canvas',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit{
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  formElements: Element[] = [];
  isEditing: boolean = false;

  constructor(private _formBuilderService:FormBuilderService){}

  ngOnInit(): void {
    this._formBuilderService.elements$.subscribe((elements) => {
      this.formElements = elements;
    });
  }
  
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

    // signature field
    @ViewChild(SignaturePad) signaturePad!: SignaturePad;

    signaturePadOptions: Object = {
      minWidth: 1,
      canvasWidth: 500,
      canvasHeight: 200
    };
  
    drawComplete() {
      const dataURL = this.signaturePad.toDataURL();
      console.log('Signature captured:', dataURL);
    }
  
    clearSignature() {
      this.signaturePad.clear();
    }
  
    saveSignature() {
      if (this.signaturePad.isEmpty()) {
        alert('Please provide a signature first.');
      } else {
        const dataURL = this.signaturePad.toDataURL();
        console.log('Saved signature image:', dataURL);
      }
    }
}
