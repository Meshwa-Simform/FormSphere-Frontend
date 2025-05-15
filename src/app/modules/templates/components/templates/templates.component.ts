import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { TemplatesService } from '../../../../services/templates/templates.service';
import { TemplateOutput } from '../../interfaces/templates';

@Component({
  selector: 'app-templates',
  // prettier-ignore
  // eslint-disable-next-line 
  standalone: false,
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css'
})
export class TemplatesComponent implements OnInit {
  templates: TemplateOutput[] = [];
  isLogin  = false;

  constructor(private _authService: AuthService, private _router: Router, private _templateService: TemplatesService){}
  ngOnInit(): void {
    this._authService.authenticateUser().subscribe({
      next: (data) => {
        this.isLogin = data;
      },
      error: (err: Error) => {
        console.error('Error fetching isLogin:', err);
      }
    });
    this.getTemplates();
  }

  logoutUser(): void {
    this._authService.logoutUser().subscribe();
    this._router.navigate(['/auth/login']);
  }

  getTemplates(): void {
    this._templateService.getTemplates().subscribe({
      next: (data: {message:string, template: TemplateOutput[]}) => {
        this.templates = data.template;
        console.log("Templates data : ", data);
      },
      error: (err: Error) => {
        console.error('Error fetching templates:', err);
      }
    });
  }

}
