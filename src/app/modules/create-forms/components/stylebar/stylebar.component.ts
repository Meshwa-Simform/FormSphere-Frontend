import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { Styling, Validations } from '../../interface/form';
import { ToastrService } from 'ngx-toastr';
import { ConditionalLogic, Element } from '../../interface/element';

@Component({
  selector: 'app-stylebar',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './stylebar.component.html',
  styleUrl: './stylebar.component.css',
})
export class StylebarComponent implements OnChanges, OnInit {
  isStylebarOpen = false;
  logicPanelOpen = false;
  validationPanelOpen = false;

  // Font options array
  fontOptions: string[] = [
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Oswald',
    'Raleway',
    'Poppins',
    'Merriweather',
    'Work Sans',
    'Nunito',
    'Inter',
    'PT Sans',
    'Rubik',
    'Quicksand',
    'Lato',
  ];

  // Default font is Inter
  @Input() theme: Styling = {
    pageColor: '#c2dfff',
    formColor: '#ffffff',
    fontColor: '#01458e',
    fontFamily: 'Inter',
    fontSize: 16,
  };

  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;
  @Output() styleChange = new EventEmitter<{
    css: Record<string, string>;
    theme: Styling;
  }>();

  @Input() selectedElement: Element | null = null;
  @Input() formElements: Element[] = [];
  @Output() formElementsChange = new EventEmitter<Element[]>();
  @Output() selectedElementChange = new EventEmitter<Element | null>();

  availableFields: string[] = [];
  operators: string[] = [
    'equals',
    'not equals',
    'contains',
    'not contains',
    'is empty',
    'is not empty',
  ];

  // Local copies for editing
  logic: {
    condition: string;
    action: string;
    conditionalLogic: ConditionalLogic[];
  } | null = null;
  validation: Validations = {};
  editLogic = false;

  constructor(private toastr: ToastrService) {}

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
    // Update availableFields whenever formElements changes
    if (changes['formElements'] && this.formElements) {
      console.log('Form Elements Changed:', this.formElements);
      this.availableFields = this.formElements.map((el) => el.outLabel);
    }
    // Load logic/validation from selected question
    if (changes['selectedElement']) {
      if (this.selectedElement) {
        this.logic = {
          condition: this.selectedElement?.condition ?? 'and',
          action: this.selectedElement?.action ?? 'show',
          conditionalLogic: this.selectedElement.conditionalLogic ?? [],
        };
        // Use validations for validation state
        this.validation =
          this.selectedElement.validations &&
          typeof this.selectedElement.validations === 'object' &&
          !('parse' in this.selectedElement.validations)
            ? (this.selectedElement.validations as Validations)
            : {
                required: false,
                minLength: null,
                maxLength: null,
                allowedChars: '',
              };
        console.log('Selected Element Logic:', this.logic);
        console.log('Selected Element Validations:', this.validation);
      } else {
        this.logic = null;
        this.validation = {};
      }
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
          : '16px',
      },
      theme: { ...this.theme },
    });
  }

  // Watch for changes and emit
  onThemeChange() {
    this.emitStyle();
  }

  // --- Logic Methods ---
  setShowWhen(val: string) {
    if (!this.logic) return;
    this.logic.action = val;
    this.onLogicChange();
  }

  toggleEditLogic() {
    this.editLogic = !this.editLogic;
  }

  addConditionGroup() {
    if (!this.logic) return;
    if (this.logic.conditionalLogic.length === 0) {
      this.logic.conditionalLogic.push({
        operator: '',
        value: '',
        action_questionId: ['0'],
      });
      this.onLogicChange();
    }
  }

  addCondition() {
    if (!this.logic) return;
    this.logic.conditionalLogic.push({
      operator: '',
      value: '',
      action_questionId: ['0'],
    });
    this.onLogicChange();
  }

  removeCondition(condIdx: number) {
    if (!this.logic) return;
    this.logic.conditionalLogic.splice(condIdx, 1);
    if (this.logic.conditionalLogic.length === 0) {
      this.logic.action = 'show';
      this.logic.condition = '';
    }
    this.onLogicChange();
  }

  onLogicChange() {
    if (this.selectedElement) {
      console.log('Logic Changed:', this.logic?.condition);
      this.selectedElement.conditionalLogic =
        this.logic?.conditionalLogic ?? [];
      this.selectedElement.action = this.logic?.action ?? 'show';
      this.selectedElement.condition = this.logic?.condition ?? 'and';

      const index = this.formElements.indexOf(this.selectedElement);
      // Replace with new object and update selection
      const updated = { ...this.selectedElement };
      this.formElements[index] = updated;
      this.formElementsChange.emit(this.formElements);
      this.selectedElementChange.emit(updated); // <-- emit the new reference
      console.log('Updated Element Logic:', updated.condition);
    }
  }
  onValidationChange() {
    if (this.selectedElement) {
      this.selectedElement.validations = this.validation;
      const index = this.formElements.indexOf(this.selectedElement);
      const updated = { ...this.selectedElement };
      this.formElements[index] = updated;
      this.formElementsChange.emit(this.formElements);
      this.selectedElementChange.emit(updated); // <-- emit the new reference
    }
  }

  onLogicPanelAttemptOpen() {
    if (!this.selectedElement) {
      this.toastr.warning('Please select a question to set logic.');
    }
  }

  // --- Validation Methods ---
  onValidationPanelAttemptOpen(event?: Event) {
    console.log('Attempting to open validation panel');
    console.log('Selected Element:', this.selectedElement);
    if (!this.selectedElement) {
      this.toastr.warning('Please select a question to set validations.');
      if (event) event.stopPropagation();
      return;
    }
    if (
      this.selectedElement.type &&
      this.selectedElement.type.toLowerCase() === 'heading'
    ) {
      console.log('Heading element selected, cannot set validations.');
      this.validationPanelOpen = false;
      this.toastr.info('Validations cannot be set for heading elements.');
      if (event) event.stopPropagation();
      return;
    }
  }

  onValidationPanelOpened() {
    if (
      this.selectedElement &&
      this.selectedElement.type &&
      this.selectedElement.type.toLowerCase() === 'heading'
    ) {
      this.toastr.info('Validations cannot be set for heading elements.');
      setTimeout(() => {
        this.validationPanelOpen = false;
      }, 0);
    }
  }

  // Helper: is the field a dropdown/radio/checkbox?
  isOptionField(questionId: string): boolean {
    const field = this.formElements[+questionId - 1];
    return !!field && ['dropdown', 'radio', 'checkbox'].includes(field.type);
  }

  // Helper: get options for a field
  getFieldOptions(questionId: string): string[] {
    const field = this.formElements[+questionId - 1];
    return field?.options ?? [];
  }
}
