import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../enviroments/environment';
import { HistorialCreate, HistorialRead, HistorialUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly base = `${environment.apiUrl}/historiales`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<HistorialRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<HistorialRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<HistorialRead> {
    return this.http.get<HistorialRead>(`${this.base}/${id}`);
  }

  create(body: HistorialCreate): Observable<HistorialRead> {
    return this.http.post<HistorialRead>(`${this.base}/`, body);
  }

  update(id: string, body: HistorialUpdate): Observable<HistorialRead> {
    return this.http.put<HistorialRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
