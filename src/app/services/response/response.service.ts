import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Responses } from '../../modules/my-forms/interface/responce';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private _http: HttpClient) { }

  createResponse(response: Responses) {
    return this._http.post<Responses>(`${environment.API_URL}/responses/create`, response, {
      withCredentials: true
    });
  }

  getResponsesByFormId(formId: string) {
    return this._http.get<{form:Responses[], message:string}>(`${environment.API_URL}/responses/${formId}`, {
      withCredentials: true
    });
  }
}
