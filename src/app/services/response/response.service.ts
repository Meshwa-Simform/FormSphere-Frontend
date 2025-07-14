import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Responses,
  ResponsesOutput,
} from '../../modules/my-forms/interface/response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResponseService {
  constructor(private _http: HttpClient) {}

  createResponse(response: Responses) {
    return this._http.post<Responses>(
      `${environment.API_URL}/responses/create`,
      response,
      {
        withCredentials: true,
      }
    );
  }

  getResponsesByFormId(formId: string) {
    return this._http.get<ResponsesOutput>(
      `${environment.API_URL}/responses/${formId}`,
      {
        withCredentials: true,
      }
    );
  }

  getPaginatedResponses(
    formId: string,
    page: number,
    pageSize: number,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  ) {
    const params = {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    };
    return this._http.get<ResponsesOutput>(
      `${environment.API_URL}/responses/${formId}`,
      {
        params,
        withCredentials: true,
      }
    );
  }
}
