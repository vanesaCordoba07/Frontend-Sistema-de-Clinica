import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { HistorialService } from '../../core/services/historial.service';
import { TratamientoRead, HistorialRead } from '../../models/api.models';

export interface TratamientoDialogData {
    mode: 'create' | 'edit';
    row?: TratamientoRead;
}

@Component({
    selector: 'app-tratamiento-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
    ],
    templateUrl: './tratamiento-dialog.html',
})
export class TratamientoDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly svc = inject(TratamientoService);
    private readonly historialSvc = inject(HistorialService);
    private readonly audit = inject(AuditContextService);
    private readonly dialogRef = inject(MatDialogRef<TratamientoDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);

    readonly data = inject<TratamientoDialogData>(MAT_DIALOG_DATA);

    readonly historiales = signal<HistorialRead[]>([]);

    readonly form = this.fb.nonNullable.group({
        id_historial: ['', Validators.required],
        nombre_tratamiento: ['', Validators.required],
        descripcion: [''],
        dosis: ['', Validators.required],
        duracion: [0, Validators.required],
    });

    ngOnInit(): void {
        this.historialSvc.list().subscribe({
            next: (rows) => this.historiales.set(rows),
            error: (err: HttpErrorResponse) =>
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });

        if (this.data.mode === 'edit' && this.data.row) {
            const r: TratamientoRead = this.data.row;

            this.form.patchValue({
                id_historial: r.id_historial,
                nombre_tratamiento: r.nombre_tratamiento,
                descripcion: r.descripcion,
                dosis: r.dosis,
                duracion: r.duracion,
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
                id_historial: v.id_historial,
                nombre_tratamiento: v.nombre_tratamiento,
                descripcion: v.descripcion,
                dosis: v.dosis,
                duracion: v.duracion,
                id_usuario_creacion: uid,
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) =>
                    this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });

            return;
        }

        this.svc.update(this.data.row!.id_tratamiento, {
            id_historial: v.id_historial,
            nombre_tratamiento: v.nombre_tratamiento,
            descripcion: v.descripcion,
            dosis: v.dosis,
            duracion: v.duracion,
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