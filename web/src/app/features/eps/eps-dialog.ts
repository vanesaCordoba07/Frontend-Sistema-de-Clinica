import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { EpsService } from '../../core/services/eps.service';
import { EpsRead } from '../../models/api.models';

export interface EpsDialogData {
    mode: 'create' | 'edit';
    row?: EpsRead;
}

@Component({
    selector: 'app-eps-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
    ],
    templateUrl: './eps-dialog.html',
})
export class EpsDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly svc = inject(EpsService);
    private readonly audit = inject(AuditContextService);
    private readonly dialogRef = inject(MatDialogRef<EpsDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);

    readonly data = inject<EpsDialogData>(MAT_DIALOG_DATA);

    readonly form = this.fb.nonNullable.group({
        nombre: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: [''],
        ciudad: [''],
    });

    ngOnInit(): void {
        if (this.data.mode === 'edit' && this.data.row) {
            const r = this.data.row;

            this.form.patchValue({
                nombre: r.nombre,
                direccion: r.direccion,
                telefono: r.telefono,
                correo: r.correo,
                ciudad: r.ciudad,
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
                nombre: v.nombre,
                direccion: v.direccion,
                telefono: v.telefono,
                correo: v.correo,
                ciudad: v.ciudad,

            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) =>
                    this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });

            return;
        }

        this.svc.update(this.data.row!.id_eps, {
            nombre: v.nombre,
            direccion: v.direccion,
            telefono: v.telefono,
            correo: v.correo,
            ciudad: v.ciudad,

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