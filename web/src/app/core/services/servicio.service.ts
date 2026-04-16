import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicioRead, ServicioCreate, ServicioUpdate } from '../../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class ServicioService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8000/servicios'; // Ajusta según tu backend

    list() {
        return this.http.get<ServicioRead[]>(this.url);
    }

    create(data: ServicioCreate) {
        return this.http.post<ServicioRead>(this.url, data);
    }

    update(id: string, data: ServicioUpdate) {
        return this.http.put<ServicioRead>(`${this.url}/${id}`, data);
    }

    delete(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}