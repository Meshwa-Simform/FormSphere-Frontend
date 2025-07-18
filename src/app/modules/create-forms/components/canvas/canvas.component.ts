import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilderService } from '../../../../services/formbuilder/form-builder.service';
import { Element } from '../../interface/element';
import { SignaturePad } from 'angular2-signaturepad';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/forms/form.service';
import {
  conditionalLogic,
  FormDetails,
  Styling,
  Validations,
} from '../../interface/form';
import { Form } from '../../../my-forms/interface/formOutput';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesService } from '../../../../services/templates/templates.service';
import { TemplateOutput } from '../../../templates/interfaces/templates';
import { AuthService } from '../../../../services/auth/auth.service';
import { FileUploadService } from '../../../../services/fileupload/file-upload.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

function getDefaultStyling(): Styling {
  return {
    pageColor: '#c2dfff',
    formColor: '#ffffff',
    fontColor: '#01458e',
    fontFamily: 'Inter',
    fontSize: 16,
  };
}

@Component({
  selector: 'app-canvas',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent implements OnInit, AfterViewInit, OnChanges {
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  formElements: Element[] = [];
  isEditing = false;
  formId: string | null = null;
  templateId: string | null = null;
  isDragging = false; // Track whether a drag operation is in progress
  isLogin = false;
  logoUrl: string | null = null;
  pages: Element[][] = [[]]; // each sub-array = one page
  currentPageIndex = 0;
  hoveredPageIndex = -1;

  @Input() styling: Styling | undefined;
  @Output() stylingChange = new EventEmitter<Styling>();
  @Output() selectedElementChange = new EventEmitter<Element | null>();
  @Output() elements = new EventEmitter<Element[]>();
  @Input() newFormElements: Element[] = []; // Input for form elements
  @Input() selectedElement: Element | null = null; // <-- keep only this one
  @ViewChild('logoInput') logoInput!: { nativeElement: HTMLInputElement };
  @Input() isPreviewMode = false;
  @Input() previewFormElements: Element[] = []; // Input for preview elements
  @Input() previewFormTitle = '';
  @Input() previewFormDescription = '';
  @Input() previewLogoUrl: string | null = null; // URL for the logo image
  @Output() formTitleChange = new EventEmitter<string>();
  @Output() formDescriptionChange = new EventEmitter<string>();
  @Output() logoUrlChange = new EventEmitter<string | null>();

  constructor(
    private _formBuilderService: FormBuilderService,
    private _toastr: ToastrService,
    private _router: Router,
    private _formService: FormService,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _templateService: TemplatesService,
    private _authService: AuthService,
    private _fileUploadService: FileUploadService,
    private _ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.styling = { ...getDefaultStyling(), ...this.styling };
    this.stylingChange.emit(this.styling);

    this.pages = [[]]; // Ensure at least one page

    this._formBuilderService.elements$.subscribe((elements) => {
      this.formElements = elements;
      this.distributeElementsToPages(elements);
      this.elements.emit(this.formElements); // Emit the updated elements
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
      if (this.formId && this.previewFormElements.length <= 0) {
        this.loadFormDetails(this.formId);
      } else if (this.templateId && this.previewFormElements.length <= 0) {
        this.loadTemplateDetails(this.templateId);
      }
    });
    if (this.previewFormElements || this.previewFormTitle || this.previewFormDescription) {
      this.formElements = [...this.previewFormElements];
      this.distributeElementsToPages(this.formElements);
      this._formBuilderService.updateElements([...this.formElements]); // Update the service with new elements
      this.formTitle = this.previewFormTitle;
      this.formDescription = this.previewFormDescription;
      this.logoUrl = this.previewLogoUrl;
      this.elements.emit(this.formElements); // Emit the new elements
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['styling']) {
      this.styling = {
        ...getDefaultStyling(),
        ...changes['styling'].currentValue,
      };
    }
    if (changes['newFormElements']) {
      this.formElements = changes['newFormElements'].currentValue;
      this.distributeElementsToPages(this.formElements);
      this._formBuilderService.updateElements([...this.formElements]); // Update the service with new elements
      this.elements.emit(this.formElements); // Emit the new elements
    }
    if (changes['selectedElement']) {
      const newSelectedElement = changes['selectedElement'].currentValue;
      const oldSelectedElement = changes['selectedElement'].previousValue;
      
      this.selectedElement = newSelectedElement;
      
      // If we have both old and new elements, update the reference in pages
      if (oldSelectedElement && newSelectedElement && oldSelectedElement !== newSelectedElement) {
        this.updateElementReferenceInPages(oldSelectedElement, newSelectedElement);
      }
    }
    if (changes['previewLogoUrl']) {
      this.logoUrl = changes['previewLogoUrl'].currentValue;
      console.log('Logo URL changed:', this.logoUrl);
    }
  }

  resetFormState(): void {
    this.formElements = [];
    this.pages = [[]]; // Reset to single empty page
    this.currentPageIndex = 0;
    this.formTitle = 'Form Title';
    this.formDescription = 'Form Description';
    this.selectedElement = null;
    this._formBuilderService.clearElements(); // Clear elements in the service
    this.elements.emit(this.formElements); // Emit the cleared elements
  }

  applyStyling(styling: Styling) {
    this.styling = { ...getDefaultStyling(), ...styling };
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
      this.selectedElementChange.emit(this.selectedElement);
      event.stopPropagation(); // Prevent click from propagating to parent elements
    }
  }

  // Method to select an element
  selectElement(element: Element): void {
    if (this.selectedElement === element) {
      // If the element is already selected, deselect it
      this.selectedElement = null;
      this.selectedElementChange.emit(null);
      return;
    }
    // Set the selected element
    this.selectedElement = element;
    this.selectedElementChange.emit(this.selectedElement);
  }

  // Method to delete the selected element
  deleteElement(): void {
    if (this.selectedElement) {
      // Find and remove the element from the current page
      const currentPage = this.pages[this.currentPageIndex];
      const elementIndex = currentPage.findIndex(el => el === this.selectedElement);
      if (elementIndex > -1) {
        currentPage.splice(elementIndex, 1);
      }
      
      this.selectedElement = null; // Clear the selection
      this.selectedElementChange.emit(null);
      
      // Update the flattened elements and emit
      this.emitFlattenedElements();
    }
  }

  // Load template details if templateId is provided
  loadTemplateDetails(templateId: string): void {
    this._ngxService.start();
    console.log('Template ID:', templateId);
    this._templateService.getTemplateById(templateId).subscribe({
      next: (data) => {
        const newElements = Array.isArray(data.data)
          ? data.data.flatMap((data) => this.mapFormToElement(data))
          : this.mapFormToElement(data.data);
        
        this.formElements = newElements;
        this.distributeElementsToPages(this.formElements);
        this._formBuilderService.updateElements([...this.formElements]);
        
        this.formTitle = data.data.title || 'Form Title';
        this.formTitleChange.emit(this.formTitle);
        this.formDescription = data.data.description || 'Form Description';
        this.formDescriptionChange.emit(this.formDescription);
        if (data.data.logoUrl) {
          this.logoUrl = data.data.logoUrl;
          this.logoUrlChange.emit(this.logoUrl);
        }
        if (data.data.styling) {
          this.styling = data.data.styling as Styling;
          this.stylingChange.emit(this.styling);
        }
        this.elements.emit(this.formElements);
        console.log('Loaded template details:', data);
      },
      error: (err) => {
        console.error('Error loading template details:', err);
      },
    });
    this._ngxService.stop();
  }

  loadFormDetails(formId: string): void {
    this._ngxService.start();
    this._formService.getFormById(formId).subscribe({
      next: (data) => {
        const newElements = Array.isArray(data.data)
          ? data.data.flatMap((data) => this.mapFormToElement(data))
          : this.mapFormToElement(data.data);

        this.formElements = newElements;
        this.distributeElementsToPages(this.formElements);
        this._formBuilderService.updateElements([...this.formElements]);

        this.formTitle = data.data.title || 'Form Title';
        this.formTitleChange.emit(this.formTitle);
        this.formDescription = data.data.description || 'Form Description';
        this.formDescriptionChange.emit(this.formDescription);
        if (data.data.logoUrl) {
          this.logoUrl = data.data.logoUrl;
          this.logoUrlChange.emit(this.logoUrl);
        }
        if (data.data.styling) {
          this.styling = data.data.styling as Styling;
          this.stylingChange.emit(this.styling);
        }
        this.elements.emit(this.formElements);
        console.log('Loaded form details:', data);
      },
      error: (err) => {
        console.error('Error loading form details:', err);
      },
    });
    this._ngxService.stop();
  }

  // Helper method to map Form/Template to Element
  private mapFormToElement(form: Form | TemplateOutput): Element[] {
    // Build a map from questionId to questionOrder (or index+1)
    const questionIdToOrder: Record<string, number> = {};
    form.questions.forEach((q, idx) => {
      if (q.id) {
        questionIdToOrder[q.id] = q.questionOrder ?? idx + 1;
      }
    });

    return form.questions.map((question) => {
      // Ensure validations object exists
      const validations: Validations = (question.validations ||
        {}) as Validations;

      // Auto-add email/number validation if missing
      if (question.questionType === 'email' && !validations.allowedChars) {
        validations.allowedChars = 'email';
      }
      if (question.questionType === 'number' && !validations.allowedChars) {
        validations.allowedChars = 'numbers';
      }

      return {
        label: form.title,
        icon: '',
        type: question.questionType,
        placeholder: '',
        options: question.questionOptions,
        outLabel: question.questionText,
        action: question.action || '',
        condition: question.condition || '',
        pageNumber: question.pageNumber || 1, // Ensure pageNumber is included
        questionOrder: question.questionOrder || 1, // Ensure questionOrder is included
        conditionalLogic:
          question.ConditionalLogic?.map((logic) => ({
            questionId: ((question.questionOrder ?? 0) + 1).toString() || '0',
            operator: logic.operator,
            value: logic.value,
            action_questionId: (logic.action_questionId || []).map(
              (id: string) =>
                questionIdToOrder[id] ? questionIdToOrder[id].toString() : id
            ),
          })) || [],
        validations,
      };
    });
  }

  // for changing of field title and description(placeholder)
  clearPlaceholder(field: 'formTitle' | 'formDescription', event: FocusEvent) {
    const element = event.target as HTMLElement;
    if (
      element.innerText.trim() === 'Form Title' ||
      element.innerText.trim() === 'Form Description'
    ) {
      element.innerText = '';
    }
  }
  restorePlaceholder(
    field: 'formTitle' | 'formDescription',
    event: FocusEvent
  ) {
    const element = event.target as HTMLElement;
    const text = element.innerText.trim();
    if (text === '') {
      element.innerText =
        this[field] === this.formTitle ? 'Form Title' : 'Form Description'; // reset placeholder
    } else {
      this[field] = text; // save typed content
      if (field === 'formTitle') {
        this.formTitleChange.emit(this.formTitle);
      } else if (field === 'formDescription') {
        this.formDescriptionChange.emit(this.formDescription);
      }
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
    const MAX_OPTIONS = 20;
    if ((field.options?.length ?? 0) >= MAX_OPTIONS) {
      this._toastr.warning(`You can add up to ${MAX_OPTIONS} options only.`);
      return;
    }
    (field.options ??= []).push('');
  }

  removeOption(field: Element, index: number) {
    (field.options ??= []).splice(index, 1);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Optionally: validate file type/size here
      this._fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.logoUrl = response.url;
          this.logoUrlChange.emit(this.logoUrl); // Emit the new logo URL
          this._toastr.success('Logo uploaded successfully!');
          // Reset the file input so the same file can be selected again
          if (this.logoInput && this.logoInput.nativeElement) {
            this.logoInput.nativeElement.value = '';
          }
        },
        error: (err) => {
          this._toastr.error('Error uploading logo. Please try again.');
          console.error('Error uploading logo:', err);
          // Reset the file input on error as well
          if (this.logoInput && this.logoInput.nativeElement) {
            this.logoInput.nativeElement.value = '';
          }
        },
      });
    }
  }

  // Add this method to trigger the file input click
  triggerLogoInput(): void {
    if (this.logoInput && this.logoInput.nativeElement) {
      this.logoInput.nativeElement.click();
    }
  }

  saveForm() {
    // Get flattened elements
    const flattenedElements = this.getFlattenedElements();
    
    // Check if form is empty
    if (flattenedElements.length === 0) {
      this._toastr.warning('The form is empty. Please add some elements.');
      return;
    }
    // Check if formTitle is unchanged
    if (this.formTitle === 'Form Title') {
      this._toastr.warning('Please update the form title.');
      return;
    }
    // If formDescription is unchanged, set it to an empty string
    const description =
      this.formDescription === 'Form Description' ? '' : this.formDescription;
    
    // form details
    const formDetails: FormDetails = {
      title: this.formTitle,
      description: description,
      logoUrl: this.logoUrl, // <-- include logoUrl
      noOfPages: this.pages.length,
      questions: flattenedElements.map((element, index) => {
        return {
          validations: element.validations ?? {},
          questionType: element.type,
          questionText: element.outLabel,
          questionOptions: element.options || [],
          questionAnswer: undefined,
          pageNumber: element.pageNumber || 1,
          questionOrder: element.questionOrder || index+1,
          isRequired: false,
          isHidden: false,
          conditionalLogic: (element.conditionalLogic || []).map(
            (logic: conditionalLogic) => ({
              operator: logic.operator ?? '',
              value: logic.value ?? '',
              action_questionId: logic.action_questionId ?? [],
            })
          ),
          action: element.action || '',
          condition: element.condition || '',
        };
      }),
      privateSharingToken: undefined,
      styling: this.styling, // Save styling with the form
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
          this._toastr.error(
            err.error.message || 'Failed to update form. Please try again.'
          );
        },
      });
    } else {
      // Call the service to create the form
      this._formService.createForm(formDetails).subscribe({
        next: () => {
          this._toastr.success('Form created successfully!');
          this._router.navigate(['/my-forms']);
        },
        error: (err) => {
          console.error('Error creating form:', err);
          this._toastr.error('Failed to create form. Please try again.');
        },
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
    this.pages = [[]]; // Reset to single empty page
    this.currentPageIndex = 0;
    this._formBuilderService.clearElements();
    this.formTitle = 'Form Title';
    this.formDescription = 'Form Description';
    this.selectedElement = null; // Clear the selected element
    this.selectedElementChange.emit(null); // Emit null to clear selection in parent component
    this.styling = getDefaultStyling(); // Reset styling to default
    this.stylingChange.emit(this.styling); // Emit the default styling
    this.elements.emit(this.formElements); // Emit the cleared elements
    this.logoUrl = null; // Reset logo
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
    this.emitFlattenedElements(); // Update and emit flattened elements
  }

  // Drag and Drop
  drop(event: CdkDragDrop<Element[]>) {
    console.log('canvas drop event:', event);
    const currentPage = this.pages[this.currentPageIndex];
    
    if (event.previousContainer === event.container) {
      // Reordering within the same page
      moveItemInArray(
        currentPage,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Adding new element from sidebar to current page
      copyArrayItem(
        event.previousContainer.data,
        currentPage,
        event.previousIndex,
        event.currentIndex
      );
      // Set the page number for the new element
      const newElement = currentPage[event.currentIndex];
      if (newElement) {
        newElement.pageNumber = this.currentPageIndex + 1;
      }
    }
    
    this.emitFlattenedElements();
  }

  // Optional: Adjust drag preview position for scrolling
  ngAfterViewInit() {
    const canvas = document.querySelector('.form-canvas');
    if (canvas) {
      canvas.addEventListener('scroll', () => {
        const previews = document.querySelectorAll('.cdk-drag-preview');
        previews.forEach((preview) => {
          const rect = canvas.getBoundingClientRect();
          preview.setAttribute(
            'style',
            `top: ${rect.top}px; left: ${rect.left}px;`
          );
        });
      });
    }
  }

  // signature field
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: object = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 200,
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

  // Multi-page navigation methods
  goToPage(index: number): void {
    if (index >= 0 && index < this.pages.length) {
      this.currentPageIndex = index;
    }
  }

  addPage(afterIndex: number): void {
    // Insert new empty page after the specified index
    this.pages.splice(afterIndex + 1, 0, []);
    // Navigate to the new page
    this.goToPage(afterIndex + 1);
    // Update element page numbers for elements after the inserted page
    this.updateElementPageNumbers();
  }

  removePage(pageIndex: number): void {
    // Cannot remove the last remaining page
    if (this.pages.length <= 1) {
      this._toastr.warning('Cannot remove the last page.');
      return;
    }

    // Move elements from the page being removed to the previous page (or next if it's the first page)
    const elementsToMove = this.pages[pageIndex];
    if (elementsToMove.length > 0) {
      const targetPageIndex = pageIndex > 0 ? pageIndex - 1 : 0;
      elementsToMove.forEach(element => {
        element.pageNumber = targetPageIndex + 1;
        this.pages[targetPageIndex].push(element);
      });
    }

    // Remove the page
    this.pages.splice(pageIndex, 1);

    // Adjust current page index if necessary
    if (this.currentPageIndex >= this.pages.length) {
      this.currentPageIndex = this.pages.length - 1;
    } else if (this.currentPageIndex > pageIndex) {
      this.currentPageIndex--;
    }

    // Update element page numbers for remaining pages
    this.updateElementPageNumbers();
    this.emitFlattenedElements();
  }

  getFlattenedElements(): Element[] {
    // Flatten the pages structure into a single array
    const flattened: Element[] = [];
    this.pages.forEach((page, pageIndex) => {
      page.forEach(element => {
        // Ensure pageNumber is set correctly
        element.pageNumber = pageIndex + 1;
        flattened.push(element);
      });
    });
    return flattened;
  }

  private updateElementPageNumbers(): void {
    // Update page numbers for all elements based on their current page position
    this.pages.forEach((page, pageIndex) => {
      page.forEach(element => {
        element.pageNumber = pageIndex + 1;
      });
    });
  }

  private emitFlattenedElements(): void {
    // Get flattened elements and emit them
    this.formElements = this.getFlattenedElements();
    this.elements.emit(this.formElements);
    this._formBuilderService.updateElements([...this.formElements]);
  }

  private distributeElementsToPages(elements: Element[]): void {
    // Clear existing pages
    this.pages = [];
    
    if (elements.length === 0) {
      this.pages = [[]];
      return;
    }

    // Find the maximum page number
    const maxPageNumber = Math.max(...elements.map(e => e.pageNumber || 1), 1);
    
    // Initialize pages array
    this.pages = Array.from({ length: maxPageNumber }, () => []);
    
    // Distribute elements to their respective pages
    elements.forEach(element => {
      const pageIndex = (element.pageNumber || 1) - 1;
      if (pageIndex >= 0 && pageIndex < this.pages.length) {
        element.pageNumber = pageIndex + 1; // Ensure pageNumber is set
        this.pages[pageIndex].push(element);
      } else {
        // If pageNumber is invalid, put it on the first page
        element.pageNumber = 1;
        this.pages[0].push(element);
      }
    });

    // Ensure at least one page exists
    if (this.pages.length === 0) {
      this.pages.push([]);
    }
  }

  private updateElementReferenceInPages(oldElement: Element, newElement: Element): void {
    // Find and replace the old element reference with the new one in pages
    for (const [pageIndex, page] of this.pages.entries()) {
      for (const [elementIndex, element] of page.entries()) {
        if (element === oldElement) {
          // Replace the old element reference with the new one
          this.pages[pageIndex][elementIndex] = newElement;
          // Update the flattened elements to reflect the change
          this.emitFlattenedElements();
          return;
        }
      }
    }
  }
}
