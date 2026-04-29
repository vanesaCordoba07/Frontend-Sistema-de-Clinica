import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CitaCreate, CitaRead, CitaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly base = `${environment.apiUrl}/citas`;

  constructor(private readonly http: HttpClient) { }

  list(): Observable<CitaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<CitaRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<CitaRead> {
    return this.http.get<CitaRead>(`${this.base}/${id}`);
  }

  create(body: CitaCreate): Observable<CitaRead> {
    return this.http.post<CitaRead>(`${this.base}/`, body);
  }

  update(id: string, body: CitaUpdate): Observable<CitaRead> {
    return this.http.put<CitaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
