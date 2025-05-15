import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../../services/forms/form.service';
import { FormOutputWithId } from '../../interface/formOutput';
import { SignaturePad } from 'angular2-signaturepad';
import { ResponseService } from '../../../../services/response/response.service';
import { ToastrService } from 'ngx-toastr';
import { Answer } from '../../interface/responce';
import { Element } from '../../../create-forms/interface/element';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-shared-form',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './shared-form.component.html',
  styleUrl: './shared-form.component.css'
})
export class SharedFormComponent implements OnInit {
  formId: string | null = null;
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  formElements: Element[] = [];
  formGroup!: FormGroup;

  constructor(private _route: ActivatedRoute, private _router: Router, private _fb: FormBuilder, private _formService: FormService, private _responseService: ResponseService, private _tostr: ToastrService,private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start(); // Start the loader

    // Initialize the form group
    this.formGroup = this._fb.group({});

    // Get the form ID from the route
    this.formId = this._route.snapshot.paramMap.get('formId');
    if (this.formId) {
      this.loadFormDetails(this.formId);
    }
    else {
      this.ngxService.stop(); // Stop the loader
    }
  }

  loadFormDetails(formId: string): void {
    this._formService.getFormById(formId).subscribe({
      next: (data: FormOutputWithId) => {
        this.formTitle = data.form.title || 'Form Title';
        this.formDescription = data.form.description || 'Form Description';
        this.formElements = data.form.questions.map((q) => {
          return {
            id: q.id,
            outLabel: q.questionText,
            type: q.questionType,
            options: q.questionOptions,
            isRequired: q.isRequired,
            label: q.questionText,
            icon: ''
          }
        }) || [];
        this.initializeForm();
        this.ngxService.stop(); // Stop the loader
      },
      error: (err: Error) => {
        console.error('Error loading form details:', err);
        this.ngxService.stop(); // Stop the loader
      }
    });
  }

  initializeForm(): void {
    this.formElements.forEach((element) => {
      if (element.type === 'checkbox') {
        // Create a FormArray for checkboxes
        const checkboxes = (element.options ?? []).map(() => this._fb.control(false));
        if (element.id) {
          this.formGroup.addControl(element.id, this._fb.array(checkboxes));
        }
      } else {
        const control = this._fb.control(
          element.defaultValue || '',
          element.isRequired ? Validators.required : null
        );
        if (element.id) {
          this.formGroup.addControl(element.id, control);
        }
      }
    });
  }

  selectedFiles: Record<string, File> = {}; // Store files by field ID

  onFileSelected(event: Event, fieldId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles[fieldId] = file; // Store the file with its field ID
      console.log('Selected file for field', fieldId, ':', file);
    }
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;

      // Transform the data into the desired format
      const transformedData: Answer[] = this.formElements
        .filter((field) => field.id) // Ensure field.id is not undefined
        .map((field) => {
          const baseData = {
            questionId: field.id as string, // Cast to string since we filtered undefined
            questionType: field.type,
            questionText: field.outLabel,
            questionOptions: field.options || [],
            questionAnswer: field.defaultValue,
            questionOrder: this.formElements.indexOf(field) + 1,
          };
      
        switch (field.type) {
          case 'checkbox': {
            const selectedOptions = field.id && formValues[field.id]
              ? formValues[field.id]
                  .map((checked: boolean, i: number) => (checked ? (field.options ?? [])[i] : null))
                  .filter((value: string | null) => value !== null)
              : [];
            return { ...baseData, responseAnswer: selectedOptions.join(', ')};
          }
      
          case 'signature': {
            const signatureData = !this.signaturePad.isEmpty()
              ? this.signaturePad.toDataURL()
              : null;
            return { ...baseData, responseAnswer: signatureData};
          }
      
          case 'file': {
            const file = field.id ? this.selectedFiles[field.id] : undefined;
            return { ...baseData, responseAnswer: file ? file.name : '' };
          }
      
          default: {
            return { ...baseData, responseAnswer: field.id ? formValues[field.id] || '' : '' };
          }
        }
      });

      console.log('Transformed Data:', transformedData);

      if (this.formId) {
        this._responseService.createResponse({ formId: this.formId, answers: transformedData }).subscribe({
          next: () => {
            this._tostr.success('Response submitted successfully!');
            this.formGroup.reset();
            this._router.navigate(['/thank-you']);
          },
          error: (error) => {
            console.error('Error submitting response:', error);
            this._tostr.error('Error submitting response. Please try again.');
          }
        });
      } else {
        console.error('Form ID is null. Cannot submit response.');
        this._tostr.error('Error: Form ID is missing. Please try again.');
      }

    } else {
      this._tostr.error('Please fill out all required fields.');
    }
  }
  // signature field
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: object = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 200
  };

  clearSignature() {
    this.signaturePad.clear();
  }

}
