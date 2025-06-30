import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../../services/forms/form.service';
import { Form, FormOutput } from '../../interface/formOutput';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-my-forms',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './my-forms.component.html',
  styleUrl: './my-forms.component.css'
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
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchInputChanged.pipe(debounceTime(400)).subscribe(value => {
      this.searchQuery = value.trim();
      this.page = 1;
      this.updateRoute();
      this.getForms();
    });

    this._route.queryParamMap.subscribe(params => {
      const pageParam = Number(params.get('page'));
      const pageSizeParam = Number(params.get('pageSize'));
      if (pageParam > 0) this.page = pageParam;
      if (pageSizeParam > 0) this.pageSize = pageSizeParam;
      this.getForms();
      this.updateRoute();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  getForms(): void {
    this._formsService.getUserForms(this.page, this.pageSize, this.searchQuery).subscribe({
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
        this.totalPages = Math.max(1, Math.ceil(this.totalForms / this.pageSize));
      },
      error: (err) => {
        console.error('Error fetching forms:', err);
        this.forms = [];
        this.totalForms = 0;
        this.totalPages = 1;
      }
    });
  }

  onSearchInputChange(value: string): void {
    this.searchInput = value;
    this.searchInputChanged.next(value);
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.updateRoute();
    this.getForms();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.pageSize = Number(value);
    this.page = 1;
    this.updateRoute();
    this.getForms();
  }

  updateRoute(): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { page: this.page, pageSize: this.pageSize },
      queryParamsHandling: 'merge'
    });
  }

  get pageNumbers(): number[] {
    // Show up to 5 pages around current page for better UX
    const total = this.totalPages;
    const current = this.page;
    const delta = 2;
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    if (current <= delta) end = Math.min(total, 1 + 2 * delta);
    if (current + delta > total) start = Math.max(1, total - 2 * delta);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
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
