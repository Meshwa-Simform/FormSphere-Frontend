import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormService } from '../../../../services/forms/form.service';
import { FormOutputWithId, Styling } from '../../interface/formOutput';
import { SignaturePad } from 'angular2-signaturepad';
import { ResponseService } from '../../../../services/response/response.service';
import { ToastrService } from 'ngx-toastr';
import { Answer } from '../../interface/response';
import { Element } from '../../../create-forms/interface/element';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileUploadService } from '../../../../services/fileupload/file-upload.service';
import {
  Validations,
  conditionalLogic,
} from '../../../create-forms/interface/form';

@Component({
  selector: 'app-shared-form',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './shared-form.component.html',
  styleUrl: './shared-form.component.css',
})
export class SharedFormComponent implements OnInit {
  formId: string | null = null;
  formTitle = 'Form Title';
  formDescription = 'Form Description';
  logoUrl: string | null = null;
  formElements: Element[] = [];
  formGroup!: FormGroup;
  styling: Styling | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _formService: FormService,
    private _responseService: ResponseService,
    private _tostr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private _fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef // <-- add this
  ) {}

  ngOnInit(): void {
    this.ngxService.start(); // Start the loader

    // Initialize the form group
    this.formGroup = this._fb.group({});

    // Get the form ID from the route
    this.formId = this._route.snapshot.paramMap.get('formId');
    if (this.formId) {
      this.loadFormDetails(this.formId);
    } else {
      this.ngxService.stop(); // Stop the loader
    }
  }

  loadFormDetails(formId: string): void {
    this._formService.getFormById(formId).subscribe({
      next: (data: FormOutputWithId) => {
        this.formTitle = data.data.title || 'Form Title';
        this.formDescription = data.data.description || 'Form Description';
        this.logoUrl = data.data.logoUrl || null;
        this.formElements =
          data.data.questions.map((q) => {
            let validations: Validations = {};
            // If validations is a string, parse it
            if (typeof q.validations === 'string') {
              try {
                validations = JSON.parse(q.validations);
              } catch {
                validations = {};
              }
            } else if (q.validations) {
              validations = q.validations as Validations;
            }
            return {
              id: q.id,
              outLabel: q.questionText,
              type: q.questionType,
              options: q.questionOptions,
              isRequired: q.isRequired,
              label: q.questionText,
              icon: '',
              validations,
              action: q.action,
              condition: q.condition,
              conditionalLogic: q.ConditionalLogic || [],
            };
          }) || [];
        this.styling = data.data.styling;
        this.initializeForm();
        this.ngxService.stop(); // Stop the loader
      },
      error: (err: Error) => {
        console.error('Error loading form details:', err);
        this.ngxService.stop(); // Stop the loader
      },
    });
  }

  initializeForm(): void {
    this.formElements.forEach((element) => {
      if (element.type === 'checkbox') {
        // Create a FormArray for checkboxes
        const checkboxes = (element.options ?? []).map(() =>
          this._fb.control(false)
        );
        if (element.id) {
          this.formGroup.addControl(element.id, this._fb.array(checkboxes));
        }
      } else {
        const validators = this.getValidators(element.validations);
        const control = this._fb.control(
          element.defaultValue || '',
          validators
        );
        if (element.id) {
          this.formGroup.addControl(element.id, control);
        }
      }
    });

    // Subscribe to valueChanges AFTER controls are added
    this.formGroup.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getValidators(validations: Validations = {}): ValidatorFn[] {
    const v: ValidatorFn[] = [];
    if (validations.required) v.push(Validators.required);
    if (validations.minLength != null)
      v.push(Validators.minLength(validations.minLength));
    if (validations.maxLength != null)
      v.push(Validators.maxLength(validations.maxLength));
    if (validations.allowedChars) {
      switch (validations.allowedChars) {
        case 'email':
          v.push(Validators.email);
          break;
        case 'numbers':
          v.push(Validators.pattern(/^[0-9]*$/));
          break;
        case 'letters':
          // Use + if required, * if not required
          v.push(
            Validators.pattern(
              validations.required ? /^[A-Za-z]+$/ : /^[A-Za-z]*$/
            )
          );
          break;
        case 'alphanumeric':
          v.push(
            Validators.pattern(
              validations.required ? /^[A-Za-z0-9]+$/ : /^[A-Za-z0-9]*$/
            )
          );
          break;
      }
    }
    return v;
  }

  selectedFiles: Record<string, string | File> = {}; // Store files by field ID

  onFileSelected(event: Event, fieldId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles[fieldId] = file; // Store the file with its field ID

      // Upload the file and store the URL
      this._fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          this.selectedFiles[fieldId] = response.url; // Replace the file with its URL
          console.log(
            'Uploaded file URL for field',
            fieldId,
            ':',
            response.url
          );
        },
        error: (err) => {
          console.error('Error uploading file:', err);
        },
      });
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
              const selectedOptions =
                field.id && formValues[field.id]
                  ? formValues[field.id]
                      .map((checked: boolean, i: number) =>
                        checked ? (field.options ?? [])[i] : null
                      )
                      .filter((value: string | null) => value !== null)
                  : [];
              return {
                ...baseData,
                responseAnswer: selectedOptions.join(', '),
              };
            }

            case 'signature': {
              const signatureData =
                this.signaturePad && !this.signaturePad.isEmpty()
                  ? this.signaturePad.toDataURL()
                  : '';
              return { ...baseData, responseAnswer: signatureData };
            }

            case 'file': {
              const file = field.id ? this.selectedFiles[field.id] : undefined;
              return { ...baseData, responseAnswer: file || '' };
            }

            default: {
              return {
                ...baseData,
                responseAnswer: field.id ? formValues[field.id].trim() || '' : '',
              };
            }
          }
        });

      console.log('Transformed Data:', transformedData);

      if (this.formId) {
        this._responseService
          .createResponse({ formId: this.formId, answers: transformedData })
          .subscribe({
            next: () => {
              this._tostr.success('Response submitted successfully!');
              this.formGroup.reset();
              this._router.navigate(['/thank-you']);
            },
            error: (error) => {
              console.error('Error submitting response:', error);
              this._tostr.error('Error submitting response. Please try again.');
            },
          });
      } else {
        console.error('Form ID is null. Cannot submit response.');
        this._tostr.error('Error: Form ID is missing. Please try again.');
      }
    } else {
      this._tostr.error('Please fill out all fields properly.');
    }
  }
  // signature field
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: object = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 200,
  };

  clearSignature() {
    this.signaturePad.clear();
  }

  shouldShowField(field: Element): boolean {
    if (
      !field.conditionalLogic ||
      !Array.isArray(field.conditionalLogic) ||
      field.conditionalLogic.length === 0
    )
      return true;
    const formValues = this.formGroup.getRawValue();
    const logicType = (field.action || 'show').toLowerCase();
    const conditionType = (field.condition || 'and').toLowerCase();

    const results = field.conditionalLogic.map((logic: conditionalLogic) => {
      // Always use action_questionId[0] for controlling field
      const controllingId =
        Array.isArray(logic.action_questionId) &&
        logic.action_questionId.length > 0
          ? logic.action_questionId[0]
          : undefined;
      const targetField = this.formElements.find((f) => f.id === controllingId);
      let targetValue = controllingId ? formValues[controllingId] : undefined;

      // Normalize value for checkboxes
      if (
        targetField &&
        targetField.type === 'checkbox' &&
        Array.isArray(targetValue)
      ) {
        targetValue = (targetValue as boolean[])
          .map((checked, idx) =>
            checked ? (targetField.options ?? [])[idx] : null
          )
          .filter((v) => v !== null);
      }

      switch (logic.operator) {
        case 'equals':
          if (Array.isArray(targetValue)) {
            return targetValue.includes(logic.value);
          }
          return targetValue == logic.value;
        case 'not equals':
          if (Array.isArray(targetValue)) {
            return !targetValue.includes(logic.value);
          }
          return targetValue != logic.value;
        case 'contains':
          return targetValue.includes(logic.value);
        case 'not contains':
          return !targetValue.includes(logic.value);
        case 'is empty':
          return (
            !targetValue ||
            (Array.isArray(targetValue)
              ? targetValue.length === 0
              : targetValue === '')
          );
        case 'is not empty':
          return (
            !!targetValue &&
            (Array.isArray(targetValue)
              ? targetValue.length > 0
              : targetValue !== '')
          );
        default:
          return false;
      }
    });

    let logicResult = false;
    if (conditionType === 'and') {
      logicResult = results.every(Boolean);
    } else if (conditionType === 'or') {
      logicResult = results.some(Boolean);
    } else {
      logicResult = results.every(Boolean); // fallback to 'and'
    }

    return logicType === 'show' ? logicResult : !logicResult;
  }
}
