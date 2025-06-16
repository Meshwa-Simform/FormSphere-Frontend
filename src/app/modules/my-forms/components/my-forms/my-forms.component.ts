import { Component, TemplateRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../../services/forms/form.service';
import { FormOutput } from '../../interface/formOutput';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-my-forms',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './my-forms.component.html',
  styleUrl: './my-forms.component.css'
})
export class MyFormsComponent implements OnInit {
  forms: FormOutput = { message: '', data: [] };

  constructor(private _formsService: FormService, private _tostr: ToastrService, private _router:Router, private _dialog: MatDialog, private _authService: AuthService) {}

  ngOnInit(): void {
    this.getForms();
  }

  getForms(): void {
    this._formsService.getUserForms().subscribe({
      next: (data) => {
        this.forms = data;
        console.log("data : ",data);
      },
      error: (err) => {
        console.error('Error fetching forms:', err);
      }
    });
  }

  updateForm(formId: string): void {
    console.log('Update Form:', formId);
    this._router.navigate(['/update-form', formId]);
  }

  viewResponses(formId: string): void {
    console.log('View Responses:', formId);
    this._router.navigate(['/responses', formId]);
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      this._tostr.success('Link copied to clipboard!');
    });
  }

  openDeleteDialog(templateRef: TemplateRef<void>, formId: string): void {
    const dialogRef = this._dialog.open(templateRef, {
      width: '400px',
      data: { formId },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log('Dialog result:', confirmed);
      if (confirmed) {
        this.deleteForm(formId);
      }
    });
  }

  deleteForm(formId: string): void {
    this._formsService.deleteForm(formId).subscribe({
      next: () => {
        this._tostr.success('Form deleted successfully!');
        this.getForms(); // Refresh the list after deletion
      },
      error: (err) => {
        console.error('Error deleting form:', err);
        this._tostr.error('Error deleting form');
      }
    })
  }
}
