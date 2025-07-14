import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../../services/forms/form.service';
import { Form } from '../../interface/formOutput';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-my-forms',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './my-forms.component.html',
  styleUrl: './my-forms.component.css',
})
export class MyFormsComponent implements OnInit, OnDestroy {
  forms: Form[] = [];
  totalForms = 0;
  searchQuery = '';
  searchInput = '';
  page = 1;
  pageSize = 5;
  pageSizes = [2, 5, 8, 10, 15, 20];
  totalPages = 1;

  private searchInputChanged: Subject<string> = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private _formsService: FormService,
    private _tostr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _authService: AuthService,
    private _ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this._ngxService.start();
    this.searchSub = this.searchInputChanged
    .pipe(debounceTime(400))
    .subscribe((value) => {
      this.searchQuery = value.trim();
      this.page = 1;
        // this.updateRoute();
        this.getForms();
      });
      
      this._route.queryParamMap.subscribe((params) => {
        const pageParam = Number(params.get('page'));
        const pageSizeParam = Number(params.get('pageSize'));
        if (pageParam > 0) this.page = pageParam;
        if (pageSizeParam > 0) this.pageSize = pageSizeParam;
        this.getForms();
        // this.updateRoute();
      });
    }
    
    ngOnDestroy(): void {
      this.searchSub?.unsubscribe();
    }
    
    getForms(): void {
      this._formsService
      .getUserForms(this.page, this.pageSize, this.searchQuery)
      .subscribe({
        next: (data) => {
          if (data.data && Array.isArray(data.data.forms)) {
            this.forms = data.data.forms;
            this.totalForms = data.data.total || data.data.forms.length;
            this.page = data.data.page || this.page;
            this.pageSize = data.data.pageSize || this.pageSize;
          } else {
            this.forms = [];
            this.totalForms = 0;
          }
          this.totalPages = Math.max(
            1,
            Math.ceil(this.totalForms / this.pageSize)
          );
          this.updatePageNumbers();
          this._ngxService.stop();
        },
        error: (err) => {
          console.error('Error fetching forms:', err);
          this.forms = [];
          this.totalForms = 0;
          this.totalPages = 1;
          this.updatePageNumbers();
          this._ngxService.stop();
        },
      });
  }

  onSearchInputChange(value: string): void {
    this.searchInput = value;
    this.searchInputChanged.next(value);
  }

  onPageChange(newPage: number | string): void {
    if( typeof newPage === 'string' ) return;
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    // this.updateRoute();
    this.getForms();
    this.updatePageNumbers();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.pageSize = Number(value);
    this.page = 1;
    // this.updateRoute();
    this.getForms();
    this.updatePageNumbers();
  }

  // updateRoute(): void {
  //   this._router.navigate([], {
  //     relativeTo: this._route,
  //     queryParams: { page: this.page, pageSize: this.pageSize },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  pageNumbers: (number | string)[] = [];

  updatePageNumbers(): void {
    this.pageNumbers = [];

    if (this.totalPages <= 5) {
      // Show all pages if few pages
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      // Always show first page
      this.pageNumbers.push(1);

      // Show dots if current page > 3
      if (this.page > 3) {
        this.pageNumbers.push('...');
      }

      // Show middle pages
      const start = Math.max(2, this.page - 1);
      const end = Math.min(this.totalPages - 1, this.page + 1);
      for (let i = start; i <= end; i++) {
        this.pageNumbers.push(i);
      }

      // Show dots if current page < totalPages - 2
      if (this.page < this.totalPages - 2) {
        this.pageNumbers.push('...');
      }

      // Always show last page
      this.pageNumbers.push(this.totalPages);
    }
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
      },
    });
  }
}
