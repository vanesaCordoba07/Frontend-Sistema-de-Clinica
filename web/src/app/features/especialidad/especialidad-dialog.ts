import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { EspecialidadService } from '../../core/especialidad.service';
import { EspecialidadRead } from '../../models/api.models';

export interface EspecialidadDialogData {
    mode: 'create' | 'edit';
    row?: EspecialidadRead;
}

@Component({
    selector: 'app-especialidad-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
    ],
    templateUrl: './especialidad-dialog.html',
})
export class EspecialidadDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly svc = inject(EspecialidadService);
    private readonly audit = inject(AuditContextService);
    private readonly dialogRef = inject(MatDialogRef<EspecialidadDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);

    readonly data = inject<EspecialidadDialogData>(MAT_DIALOG_DATA);

    readonly form = this.fb.nonNullable.group({
        nombre: ['', Validators.required],
        descripcion: [''],
    });

    constructor() {
        if (this.data.mode === 'edit' && this.data.row) {
            this.form.patchValue({
                nombre: this.data.row.nombre,
                descripcion: this.data.row.descripcion ?? '',
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
            this.snack.open('Seleccione usuario de auditoría.', 'OK');
            return;
        }

        const v = this.form.getRawValue();
        if (this.data.mode === 'create') {
            this.svc.create({ ...v, id_usuario_creacion: uid }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });
        } else {
            this.svc.update(this.data.row!.id_especialidad, { ...v, id_usuario_edicion: uid }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });
        }
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;
        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
        return err.message;
    }
}