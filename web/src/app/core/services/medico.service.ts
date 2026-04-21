import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicoRead, MedicoCreate, MedicoUpdate } from '../../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class MedicoService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8000/medicos';

    // Cambié el nombre de getMedicos a 'list' porque así lo busca tu componente
    list() {
        return this.http.get<MedicoRead[]>(this.url);
    }

    create(medico: MedicoCreate) {
        return this.http.post<MedicoRead>(this.url, medico);
    }

    update(id: string, medico: MedicoUpdate) {
        return this.http.put<MedicoRead>(`${this.url}/${id}`, medico);
    }

    delete(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}