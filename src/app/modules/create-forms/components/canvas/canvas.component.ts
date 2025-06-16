import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { FormBuilderService } from '../../../../services/formbuilder/form-builder.service';
import { Element } from '../../interface/element';
import { SignaturePad } from 'angular2-signaturepad';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/forms/form.service';
import { FormDetails } from '../../interface/form';
import { Form } from '../../../my-forms/interface/formOutput';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesService } from '../../../../services/templates/templates.service';
import { TemplateOutput } from '../../../templates/interfaces/templates';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-canvas',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})

export class CanvasComponent implements OnInit, AfterViewInit {
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  formElements: Element[] = [];
  isEditing = false;
  formId: string | null = null;
  templateId: string | null = null;
  selectedElement: Element | null = null; // Track the selected element
  isDragging = false; // Track whether a drag operation is in progress
  isLogin = false;

  constructor(private _formBuilderService: FormBuilderService, private _toastr: ToastrService, private _router: Router, private _formService: FormService, private _route: ActivatedRoute, private _dialog: MatDialog, private _templateService: TemplatesService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._formBuilderService.elements$.subscribe((elements) => {
      this.formElements = elements;
    });
    // Check if the user is logged in
    this._authService.authenticateUser().subscribe((isLoggedIn: boolean) => {
      this.isLogin = isLoggedIn;
    });
    // Listen for route changes
    this._route.params.subscribe((params) => {
      this.formId = params['formId'] || null;
      this.templateId = params['templateId'] || null;

      // Reset form state
      this.resetFormState();

      // Load form or template details based on the route
      if (this.formId) {
        this.loadFormDetails(this.formId);
      } else if (this.templateId) {
        this.loadTemplateDetails(this.templateId);
      }
    });
  }

  resetFormState(): void {
    this.formElements = [];
    this.formTitle = 'Form Title';
    this.formDescription = 'Form Description';
    this.selectedElement = null;
    this._formBuilderService.clearElements(); // Clear elements in the service
  }

  // Method to handle drag start
  onDragStart(): void {
    this.isDragging = true;
  }

  // Method to handle drag end
  onDragEnd(): void {
    this.isDragging = false;
  }

  // Method to handle element click
  onElementClick(element: Element, event: MouseEvent): void {
    if (!this.isDragging) {
      // Only select the element if it's not being dragged
      this.selectedElement = element;
      event.stopPropagation(); // Prevent click from propagating to parent elements
    }
  }

  // Method to select an element
  selectElement(element: Element): void {
    if(this.selectedElement === element){
      // If the element is already selected, deselect it
      this.selectedElement = null;
      return;
    }
    // Set the selected element
    this.selectedElement = element;
  }

  // Method to delete the selected element
  deleteElement(): void {
    if (this.selectedElement) {
      this._formBuilderService.removeElement(this.selectedElement); // Use the service to remove the element
      this.selectedElement = null; // Clear the selection
    }
  }

  // Load form details if formId is provided
  loadFormDetails(formId: string): void {
    this._formService.getFormById(formId).subscribe({
      next: (data) => {
        const newElements = Array.isArray(data.data)
          ? data.data.flatMap((data) => this.mapFormToElement(data))
          : this.mapFormToElement(data.data);

        newElements.forEach((element) => {
          this._formBuilderService.addElement(element); // add each element to the form builder
        })

        this.formTitle = data.data.title || 'Form Title';
        this.formDescription = data.data.description || 'Form Description';
        console.log('Loaded form details:', this.formElements);
      },
      error: (err) => {
        console.error('Error loading form details:', err);
      }
    });
  }

  // Load template details if templateId is provided
  loadTemplateDetails(templateId: string): void {
    console.log('Template ID:', templateId);
    this._templateService.getTemplateById(templateId).subscribe({
      next: (data) => {
        const newElements = Array.isArray(data.data)
          ? data.data.flatMap((data) => this.mapFormToElement(data))
          : this.mapFormToElement(data.data);
        newElements.forEach((element) => {
          this._formBuilderService.addElement(element); // add each element to the form builder
        })
        this.formTitle = data.data.title || 'Form Title';
        this.formDescription = data.data.description || 'Form Description';
        console.log('Loaded template details:', this.formElements);
      },
      error: (err) => {
        console.error('Error loading template details:', err);
      }
    });
  }

  // Helper method to map Form/Tmplate to Element
  private mapFormToElement(form: Form | TemplateOutput): Element[] {
    return form.questions.map((question) => ({
      label: form.title,
      icon: '',
      type: question.questionType,
      placeholder: '',
      options: question.questionOptions,
      outLabel: question.questionText
    }));
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

  onOptionFocus(event: FocusEvent, index: number): void {
    this.isEditing = true;
    console.log(`Editing option at index ${index}`);
  }

  updateOption(field: Element, index: number, event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.trim();

    if (newValue) {
      (field.options ??= [])[index] = newValue; // Ensure options is initialized and update the option in the array
    } else {
      // If the input is empty, revert to the original value
      inputElement.value = (field.options ??= [])[index];
    }
  }

  addOption(field: Element) {
    (field.options ??= []).push('');
  }

  removeOption(field: Element, index: number) {
    (field.options ??= []).splice(index, 1);
  }

  saveForm() {
    // Check if formElements is empty
    if (this.formElements.length === 0) {
      this._toastr.warning('The form is empty. Please add some elements.');
      return;
    }
    // Check if formTitle is unchanged
    if (this.formTitle === 'Form Title') {
      this._toastr.warning('Please update the form title.');
      return;
    }
    // If formDescription is unchanged, set it to an empty string
    const description = this.formDescription === 'Form Description' ? '' : this.formDescription;
    // form details
    const formDetails: FormDetails = {
      title: this.formTitle,
      description: description,
      logoUrl: null,
      isSinglePage: true,
      noOfPages: 1,
      questions: this.formElements.map((element, index) => {
        return {
          validations: [],
          pageNumber: 1,
          questionType: element.type,
          questionText: element.outLabel,
          questionOptions: element.options || [],
          questionAnswer: undefined,
          questionOrder: index + 1,
          isRequired: false,
          isHidden: false,
          conditionalLogic: undefined,
        };
      }),
      privateSharingToken: undefined,
      styling: undefined,
    };

    console.log('Form Details:', formDetails);
    // Call the service for update form
    if (this.formId) {
      this._formService.updateForm(this.formId, formDetails).subscribe({
        next: () => {
          this._toastr.success('Form updated successfully!');
          this._router.navigate(['/my-forms']);
        },
        error: (err) => {
          console.error('Error updating form:', err);
          this._toastr.error(err.error.message || 'Failed to update form. Please try again.');
        }
      });
    }
    else {
      // Call the service to create the form
      this._formService.createForm(formDetails).subscribe({
        next: () => {
          this._toastr.success('Form created successfully!');
          this._router.navigate(['/my-forms']);
        },
        error: (err) => {
          console.error('Error creating form:', err);
          this._toastr.error('Failed to create form. Please try again.');
        }
      });
    }
  }

  openDeleteDialog(templateRef: TemplateRef<void>): void {
    const dialogRef = this._dialog.open(templateRef, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log('Dialog result:', confirmed);
      if (confirmed) {
        this.clearForm();
      }
    });
  }

  clearForm() {
    this.formElements = [];
    this._formBuilderService.clearElements();
  }

  // Called when editing starts for question i.e. h2 tags as drag and drop prevented editing by default
  onEditStart(): void {
    console.log('Editing started');
    this.isEditing = true;
  }
  // Called when editing ends
  updateLabel(field: Element, event: FocusEvent): void {
    const element = event.target as HTMLElement;
    const newLabel = element.innerText.trim();

    if (newLabel) {
      field.outLabel = newLabel; // Update the label in the formElements array
    } else {
      element.innerText = field.outLabel; // Revert to the original label if empty
    }

    this.isEditing = false; // End editing mode
    console.log('Label updated:', field.outLabel);
  }

  // Drag and Drop
  drop(event: CdkDragDrop<Element[]>) {
    console.log('canvas drop event:', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this._formBuilderService.updateElements([...this.formElements]);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this._formBuilderService.updateElements([...this.formElements]);
    }
  }

  // Optional: Adjust drag preview position for scrolling
  ngAfterViewInit() {
    const canvas = document.querySelector('.form-canvas');
    if (canvas) {
      canvas.addEventListener('scroll', () => {
        const previews = document.querySelectorAll('.cdk-drag-preview');
        previews.forEach((preview) => {
          const rect = canvas.getBoundingClientRect();
          preview.setAttribute('style', `top: ${rect.top}px; left: ${rect.left}px;`);
        });
      });
    }
  }

  // signature field
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: object = {
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
