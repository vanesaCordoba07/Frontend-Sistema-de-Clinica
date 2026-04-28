import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { AuditContextService } from '../../core/audit-context.service';
import { PacienteService } from '../../core/services/paciente.service';
import { EpsService } from '../../core/services/eps.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { PacienteRead, EpsRead, UsuarioRead } from '../../models/api.models';

export interface PacienteDialogData {
    mode: 'create' | 'edit';
    row?: PacienteRead;
}

@Component({
    selector: 'app-paciente-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
    ],
    templateUrl: './paciente-dialog.html',
})
export class PacienteDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly svc = inject(PacienteService);
    private readonly epsSvc = inject(EpsService);
    private readonly usuarioSvc = inject(UsuarioService);
    private readonly audit = inject(AuditContextService);
    private readonly dialogRef = inject(MatDialogRef<PacienteDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);

    readonly data = inject<PacienteDialogData>(MAT_DIALOG_DATA);

    readonly epsList = signal<EpsRead[]>([]);
    readonly usuarios = signal<UsuarioRead[]>([]);

    readonly form = this.fb.nonNullable.group({
        id_eps: ['', Validators.required],
        id_usuario: ['', Validators.required],
        nombre: ['', Validators.required],
        telefono: [''],
        fecha_nacimiento: ['', Validators.required],
        direccion: [''],
        genero: ['', Validators.required],
        tipo_afiliacion: ['', Validators.required],
    });

    ngOnInit(): void {
        this.epsSvc.list().subscribe({
            next: (rows) => this.epsList.set(rows),
            error: (err: HttpErrorResponse) =>
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });

        this.usuarioSvc.list().subscribe({
            next: (rows) => this.usuarios.set(rows),
            error: (err: HttpErrorResponse) =>
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });

        if (this.data.mode === 'edit' && this.data.row) {
            const r = this.data.row;

            this.form.patchValue({
                id_eps: r.id_eps,
                id_usuario: r.id_usuario,
                nombre: r.nombre,
                telefono: r.telefono,
                fecha_nacimiento: r.fecha_nacimiento,
                direccion: r.direccion,
                genero: r.genero,
                tipo_afiliacion: r.tipo_afiliacion,
            });
        }
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const uid = this.audit.usuarioId();

        if (!uid) {
            this.snack.open('Seleccione usuario de auditoría en la barra superior.', 'OK');
            return;
        }

        const v = this.form.getRawValue();

        if (this.data.mode === 'create') {
            this.svc.create({
                id_eps: v.id_eps,
                id_usuario: v.id_usuario,
                nombre: v.nombre,
                telefono: v.telefono,
                fecha_nacimiento: v.fecha_nacimiento,
                direccion: v.direccion,
                genero: v.genero,
                tipo_afiliacion: v.tipo_afiliacion,
                id_usuario_creacion: uid,
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) =>
                    this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });

            return;
        }

        this.svc.update(this.data.row!.id_paciente, {
            id_eps: v.id_eps,
            id_usuario: v.id_usuario,
            nombre: v.nombre,
            telefono: v.telefono,
            fecha_nacimiento: v.fecha_nacimiento,
            direccion: v.direccion,
            genero: v.genero,
            tipo_afiliacion: v.tipo_afiliacion,
            id_usuario_edicion: uid,
        }).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err: HttpErrorResponse) =>
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;

        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');

        return err.message;
    }
}