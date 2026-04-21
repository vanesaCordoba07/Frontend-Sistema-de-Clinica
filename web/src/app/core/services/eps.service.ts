import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
    EpsCreate,
    EpsRead,
    EpsUpdate
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EpsService {
    private readonly base = `${environment.apiUrl}/eps`;

    constructor(private readonly http: HttpClient) { }

    list(): Observable<EpsRead[]> {
        const params = new HttpParams()
            .set('skip', 0)
            .set('limit', 500);

        return this.http.get<EpsRead[]>(`${this.base}/`, { params });
    }

    get(id: string): Observable<EpsRead> {
        return this.http.get<EpsRead>(`${this.base}/${id}`);
    }

    create(body: EpsCreate): Observable<EpsRead> {
        return this.http.post<EpsRead>(`${this.base}/`, body);
    }

    update(id: string, body: EpsUpdate): Observable<EpsRead> {
        return this.http.put<EpsRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable<void> {
        return this.http
            .delete(`${this.base}/${id}`, { observe: 'response' })
            .pipe(map(() => undefined));
    }
}