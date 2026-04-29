import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EnfermeroCreate, EnfermeroRead, EnfermeroUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EnfermeroService {
  private readonly base = `${environment.apiUrl}/historiales`;

  constructor(private readonly http: HttpClient) { }

  list(): Observable<EnfermeroRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<EnfermeroRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<EnfermeroRead> {
    return this.http.get<EnfermeroRead>(`${this.base}/${id}`);
  }

  create(body: EnfermeroCreate): Observable<EnfermeroRead> {
    return this.http.post<EnfermeroRead>(`${this.base}/`, body);
  }

  update(id: string, body: EnfermeroUpdate): Observable<EnfermeroRead> {
    return this.http.put<EnfermeroRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
