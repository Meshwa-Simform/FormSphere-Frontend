import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../services/response/response.service';
import { Responses } from '../../interface/response';
import { AuthService } from '../../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Styling } from '../../interface/formOutput';
import { FormService } from '../../../../services/forms/form.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-view-responses',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './view-responses.component.html',
  styleUrl: './view-responses.component.css',
})
export class ViewResponsesComponent implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  formId: string | null = null;
  responses: Responses[] = [];
  totalResponses = 0;
  searchQuery = '';
  searchInput = '';
  page = 1;
  pageSize = 6;
  pageSizes = [6, 9, 12, 15, 18];
  totalPages = 1;
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  sortOptions = [
    { value: 'createdAt', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
  ];
  formStyling: Styling | null = null;

  private searchInputChanged: Subject<string> = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _responseService: ResponseService,
    private _authService: AuthService,
    private _router: Router,
    private _http: HttpClient,
    private _toastx: ToastrService,
    private _formSerice: FormService,
    private _ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this._ngxService.start();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    this.userEmail = user.email;
    this.formId = this._route.snapshot.paramMap.get('formId');
    this.searchSub = this.searchInputChanged
      .pipe(debounceTime(400))
      .subscribe((value) => {
        this.searchQuery = value.trim();
        this.page = 1;
        this.getResponses();
      });

    this._route.queryParamMap.subscribe((params) => {
      const pageParam = Number(params.get('page'));
      const pageSizeParam = Number(params.get('pageSize'));
      const sortByParam = params.get('sortBy');
      const sortOrderParam = params.get('sortOrder');
      if (pageParam > 0) this.page = pageParam;
      if (pageSizeParam > 0) this.pageSize = pageSizeParam;
      if (sortByParam) this.sortBy = sortByParam;
      if (sortOrderParam === 'asc' || sortOrderParam === 'desc')
        this.sortOrder = sortOrderParam;
      this.getResponses();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  getResponses(): void {
    if (!this.formId) return;
    this._responseService
      .getPaginatedResponses(
        this.formId,
        this.page,
        this.pageSize,
        this.searchQuery,
        this.sortBy,
        this.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.responses = res.data.responses;
          this.totalResponses = res.data.total;
          this.totalPages = Math.max(
            1,
            Math.ceil(this.totalResponses / this.pageSize)
          );
          this.updatePageNumbers();
          this._ngxService.stop()
        },
        error: (err) => {
          this._toastx.error(err.error.message || 'Failed to fetch responses');
          this.responses = [];
          this.totalResponses = 0;
          this.totalPages = 1;
          this.updatePageNumbers();
          this._ngxService.stop();
        },
      });
    this._formSerice.getFormById(this.formId).subscribe({
      next: (form) => {
        this.formStyling = form.data.styling ?? null;
      },
      error: (err) => {
        console.error('Error fetching form styling:', err);
        this.formStyling = null; // Reset styling on error
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
    this.getResponses();
    this.updatePageNumbers();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.pageSize = Number(value);
    this.page = 1;
    this.getResponses();
    this.updatePageNumbers();
  }

  onSortByChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.sortBy = value;
    this.page = 1;
    this.getResponses();
  }

  onSortOrderChange() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.page = 1;
    this.getResponses();
  }


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

  downloadFile(fileUrl: string): void {
    console.log('Downloading file:', fileUrl);
    this._http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getFileNameFromUrl(fileUrl); // Extract file name from URL
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object
        this._toastx.success('File downloaded successfully');
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      },
    });
  }

  // Helper method to extract file name from URL
  getFileNameFromUrl(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'downloaded-file';
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }
}
