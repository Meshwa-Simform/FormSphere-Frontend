import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TemplateOutput } from '../../modules/templates/interfaces/templates';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(private _http: HttpClient) { }

  getTemplates() {
    return this._http.get<{ message: string, data: TemplateOutput[] }>(`${environment.API_URL}/templates`, {
      withCredentials: true
    });
  }

  getTemplateById(templateId: string) {
    return this._http.get<{ message: string, data: TemplateOutput }>(`${environment.API_URL}/templates/${templateId}`, {
      withCredentials: true
    });
  }
}
