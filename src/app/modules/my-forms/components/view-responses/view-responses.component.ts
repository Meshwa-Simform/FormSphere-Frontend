import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../services/response/response.service';
import { Responses } from '../../interface/response';
import { AuthService } from '../../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-view-responses',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './view-responses.component.html',
  styleUrl: './view-responses.component.css',
})
export class ViewResponsesComponent implements OnInit, OnDestroy {
  formId: string | null = null;
  responses: Responses[] = [];
  totalResponses = 0;
  searchQuery = '';
  searchInput = '';
  page = 1;
  pageSize = 5;
  pageSizes = [2, 5, 8, 10, 15, 20];
  totalPages = 1;
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  sortOptions = [
    { value: 'createdAt', label: 'Date' },
    { value: 'userName', label: 'Name' },
    { value: 'userEmail', label: 'Email' },
  ];

  private searchInputChanged: Subject<string> = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _responseService: ResponseService,
    private _authService: AuthService,
    private _router: Router,
    private _http: HttpClient,
    private _toastx: ToastrService
  ) {}

  ngOnInit(): void {
    this.formId = this._route.snapshot.paramMap.get('formId');
    this.searchSub = this.searchInputChanged
      .pipe(debounceTime(400))
      .subscribe((value) => {
        this.searchQuery = value.trim();
        this.page = 1;
        this.updateRoute();
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
      this.updateRoute();
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
        },
        error: (err) => {
          this._toastx.error(err.error.message || 'Failed to fetch responses');
          this.responses = [];
          this.totalResponses = 0;
          this.totalPages = 1;
        },
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
    this.getResponses();
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.pageSize = Number(value);
    this.page = 1;
    this.updateRoute();
    this.getResponses();
  }

  onSortByChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    this.sortBy = value;
    this.page = 1;
    this.updateRoute();
    this.getResponses();
  }

  onSortOrderChange() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.page = 1;
    this.updateRoute();
    this.getResponses();
  }

  updateRoute(): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        page: this.page,
        pageSize: this.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      },
      queryParamsHandling: 'merge',
    });
  }

  get pageNumbers(): number[] {
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
