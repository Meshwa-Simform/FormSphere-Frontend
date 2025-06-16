import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../services/response/response.service';
import { Responses } from '../../interface/responce';
import { AuthService } from '../../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-responses',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './view-responses.component.html',
  styleUrl: './view-responses.component.css'
})
export class ViewResponsesComponent implements OnInit {
  formId: string | null = null;
  responses: Responses[] = [];
  filteredResponses: Responses[] = [];
  searchQuery = '';

  constructor(private _route: ActivatedRoute, private _responseService: ResponseService, private _authService: AuthService, private _router:Router, private _http: HttpClient, private _toastx: ToastrService) {}

  ngOnInit(): void {
    this.formId = this._route.snapshot.paramMap.get('formId');
    if (this.formId) {
      this.getResponses(this.formId);
    }
  }

  getResponses(formId: string): void {
    this._responseService.getResponsesByFormId(formId).subscribe({
      next: (data) => {
        this.responses = data.data;
        this.filteredResponses = data.data;
        console.log('Responses:', this.responses);
      },
      error: (err) => {
        this._toastx.error(err.error.message || 'Failed to fetch responses');
        console.error('Error fetching responses:', err);
      }
    });
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
      }
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

  filterResponses(): void {
    this.filteredResponses = this.responses.filter((response) => {
      const query = this.searchQuery.toLowerCase();
      return (
        response.userName?.toLowerCase().includes(query) ||
        (response.userEmail?.toLowerCase().includes(query) || '')
      );
    });
  }
}

