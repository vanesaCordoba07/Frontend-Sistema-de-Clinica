import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {

    FacturaRead,
    TratamientoCreate,
    TratamientoRead,
    TratamientoUpdate
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class TratamientoService {
    private readonly base = `${environment.apiUrl}/tratamientos`;

    constructor(private readonly http: HttpClient) { }

    list(): Observable<TratamientoRead[]> {
        const params = new HttpParams()
            .set('skip', 0)
            .set('limit', 500);

        return this.http.get<TratamientoRead[]>(`${this.base}/`, { params });
    }

    get(id: string): Observable<TratamientoRead> {
        return this.http.get<TratamientoRead>(`${this.base}/${id}`);
    }

    create(body: TratamientoCreate): Observable<TratamientoRead> {
        return this.http.post<TratamientoRead>(`${this.base}/`, body);
    }

    update(id: string, body: TratamientoUpdate): Observable<TratamientoRead> {
        return this.http.put<TratamientoRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable<void> {
        return this.http
            .delete(`${this.base}/${id}`, { observe: 'response' })
            .pipe(map(() => undefined));
    }
}