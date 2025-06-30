import { Component } from '@angular/core';
import { Element } from '../../interface/element';
import { FormBuilderService } from '../../../../services/formbuilder/form-builder.service';

@Component({
  selector: 'app-sidebar',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarOpen = false;
  searchQuery = '';
  filteredElements: Element[] = [];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  constructor(private _formBuilderService: FormBuilderService) {}

  basicElements: Element[] = [
    {
      label: 'Heading',
      icon: 'title',
      type: 'heading',
      placeholder: 'Enter heading',
      outLabel: 'Heading',
    },
    {
      label: 'Full Name',
      icon: 'person',
      type: 'text',
      placeholder: 'Enter full name',
      outLabel: 'Full Name',
    },
    {
      label: 'Email',
      icon: 'email',
      type: 'email',
      placeholder: 'Enter email',
      outLabel: 'Email',
    },
    {
      label: 'Address',
      icon: 'location_on',
      type: 'text',
      placeholder: 'Enter address',
      outLabel: 'Address',
    },
    {
      label: 'Phone',
      icon: 'phone',
      type: 'text',
      placeholder: 'Enter phone number',
      outLabel: 'Phone Number',
    },
    {
      label: 'Date',
      icon: 'event',
      type: 'date',
      placeholder: 'DD-MM-YYYY',
      outLabel: 'Date',
    },
    {
      label: 'Appointment',
      icon: 'schedule',
      type: 'date',
      placeholder: 'DD-MM-YYYY',
      outLabel: 'Appointment',
    },
    {
      label: 'Signature',
      icon: 'edit',
      type: 'signature',
      outLabel: 'Signature',
    },
  ];

  basicInputs: Element[] = [
    {
      label: 'Short Text',
      icon: 'text_fields',
      type: 'text',
      placeholder: 'Enter short text',
      outLabel: 'Enter Question',
    },
    {
      label: 'Long Text',
      icon: 'notes',
      type: 'textarea',
      placeholder: 'Enter long text',
      outLabel: 'Enter Question',
    },
    {
      label: 'Paragraph',
      icon: 'article',
      type: 'textarea',
      placeholder: 'Enter paragraph',
      outLabel: 'Enter Question',
    },
    {
      label: 'Dropdown',
      icon: 'arrow_drop_down',
      type: 'dropdown',
      options: ['Option 1', 'Option 2', 'Option 3'],
      outLabel: 'Enter Question',
    },
    {
      label: 'Single Choice',
      icon: 'radio_button_checked',
      type: 'radio',
      options: ['Option 1', 'Option 2', 'Option 3'],
      outLabel: 'Enter Question',
    },
    {
      label: 'Multiple Choice',
      icon: 'check_box',
      type: 'checkbox',
      options: ['Option 1', 'Option 2', 'Option 3'],
      outLabel: 'Enter Question',
    },
    {
      label: 'Number',
      icon: 'pin',
      type: 'number',
      placeholder: 'Enter a number',
      outLabel: 'Enter Question',
    },
    {
      label: 'File Upload',
      icon: 'upload_file',
      type: 'file',
      outLabel: 'Field Upload',
    },
  ];

  // add elements to the form builder
  onElementClick(item: Element): void {
    console.log('Clicked element:', item);
    // Clone the item to ensure no shared references for options
    const newItem = {
      ...item,
      options: item.options ? [...item.options] : undefined,
    };

    this._formBuilderService.addElement(newItem);
  }

  // function for search functionality
  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (input.length === 0) {
      this.clearSearch();
      return;
    }
    this.searchQuery = input;

    this.filteredElements = [...this.basicElements, ...this.basicInputs].filter(
      (item) => {
        if (item.label.toLowerCase().includes(this.searchQuery.toLowerCase())) {
          return item;
        }
        return false;
      }
    );
  }

  // Clears the search input and resets the filtered list
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredElements = [];
  }
}
