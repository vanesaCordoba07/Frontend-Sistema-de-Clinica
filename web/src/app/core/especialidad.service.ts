import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EspecialidadRead } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8000/especialidades';

    list() {
        return this.http.get<EspecialidadRead[]>(this.url);
    }

    create(data: any) {
        return this.http.post<EspecialidadRead>(this.url, data);
    }

    update(id: string, data: any) {
        return this.http.put<EspecialidadRead>(`${this.url}/${id}`, data);
    }

    delete(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}