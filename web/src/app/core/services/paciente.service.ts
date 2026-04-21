import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {

    FacturaRead,
    PacienteCreate,
    PacienteRead,
    PacienteUpdate
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PacienteService {
    private readonly base = `${environment.apiUrl}/facturas`;

    constructor(private readonly http: HttpClient) { }

    list(): Observable<PacienteRead[]> {
        const params = new HttpParams()
            .set('skip', 0)
            .set('limit', 500);

        return this.http.get<PacienteRead[]>(`${this.base}/`, { params });
    }

    get(id: string): Observable<PacienteRead> {
        return this.http.get<PacienteRead>(`${this.base}/${id}`);
    }

    create(body: PacienteCreate): Observable<PacienteRead> {
        return this.http.post<PacienteRead>(`${this.base}/`, body);
    }

    update(id: string, body: PacienteUpdate): Observable<PacienteRead> {
        return this.http.put<PacienteRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable<void> {
        return this.http
            .delete(`${this.base}/${id}`, { observe: 'response' })
            .pipe(map(() => undefined));
    }
}