import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../services/response/response.service';
import { Responses } from '../../interface/responce';
import { AuthService } from '../../../../services/auth/auth.service';

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

  constructor(private _route: ActivatedRoute, private _responseService: ResponseService, private _authService: AuthService, private _router:Router) {}

  ngOnInit(): void {
    this.formId = this._route.snapshot.paramMap.get('formId');
    if (this.formId) {
      this.getResponses(this.formId);
    }
  }

  getResponses(formId: string): void {
    this._responseService.getResponsesByFormId(formId).subscribe({
      next: (data) => {
        this.responses = data.form;
        console.log('Responses:', this.responses);
      },
      error: (err) => {
        console.error('Error fetching responses:', err);
      }
    });
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }
}

