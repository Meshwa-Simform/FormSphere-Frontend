import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { TemplatesService } from '../../../../services/templates/templates.service';
import { TemplateOutput } from '../../interfaces/templates';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-templates',
  // prettier-ignore
  // eslint-disable-next-line
  standalone: false,
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css',
})
export class TemplatesComponent implements OnInit {
  userName = '';
  userEmail = '';
  templates: TemplateOutput[] = [];
  isLogin = false;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _templateService: TemplatesService,
    private _ngxService: NgxUiLoaderService
  ) {}
  ngOnInit(): void {
    this._ngxService.start();
    this._authService.authenticateUser().subscribe({
      next: (data) => {
        this.isLogin = data;
      },
      error: (err: Error) => {
        console.error('Error fetching isLogin:', err);
      },
    });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    this.userEmail = user.email;
    this.getTemplates();
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }

  getTemplates(): void {
    this._templateService.getTemplates().subscribe({
      next: (data) => {
        this.templates = data.data;
        console.log('Templates data : ', data);
        this._ngxService.stop();
      },
      error: (err: Error) => {
        console.error('Error fetching templates:', err);
        this._ngxService.stop();
      },
    });
  }
}
