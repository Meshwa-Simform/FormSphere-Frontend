import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { FormDetails } from '../../modules/create-forms/interface/form';
import {
  FormOutput,
  FormOutputWithId,
} from '../../modules/my-forms/interface/formOutput';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private _http: HttpClient) {}

  createForm(formDetails: FormDetails): Observable<FormDetails> {
    return this._http.post<FormDetails>(
      `${environment.API_URL}/forms/create`,
      formDetails,
      {
        withCredentials: true,
      }
    );
  }

  getFormById(formId: string): Observable<FormOutputWithId> {
    return this._http.get<FormOutputWithId>(
      `${environment.API_URL}/forms/${formId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateForm(formId: string, formDetails: FormDetails): Observable<void> {
    return this._http.put<void>(
      `${environment.API_URL}/forms/${formId}`,
      formDetails,
      {
        withCredentials: true,
      }
    );
  }

  deleteForm(formId: string): Observable<void> {
    return this._http.delete<void>(`${environment.API_URL}/forms/${formId}`, {
      withCredentials: true,
    });
  }

  getUserForms(page = 1, pageSize = 10, search = ''): Observable<FormOutput> {
    let url = `${environment.API_URL}/forms?page=${page}&pageSize=${pageSize}`;
    if (search && search.trim().length > 0) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this._http.get<FormOutput>(url, {
      withCredentials: true,
    });
  }
}
