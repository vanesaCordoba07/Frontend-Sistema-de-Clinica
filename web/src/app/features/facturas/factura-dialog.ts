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
import { FacturaService } from '../../core/services/factura.service';
import { CitaService } from '../../core/services/cita.service';
import { CitaRead, FacturaRead } from '../../models/api.models';

export interface FacturaDialogData {
    mode: 'create' | 'edit';
    row?: FacturaRead;
}

@Component({
    selector: 'app-factura-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        CommonModule
    ],
    templateUrl: './factura-dialog.html',
})
export class FacturaDialogComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly svc = inject(FacturaService);
    private readonly citaSvc = inject(CitaService);
    private readonly audit = inject(AuditContextService);
    private readonly dialogRef = inject(MatDialogRef<FacturaDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);

    readonly data = inject<FacturaDialogData>(MAT_DIALOG_DATA);
    readonly citas = signal<CitaRead[]>([]);

    readonly form = this.fb.nonNullable.group({
        id_cita: ['', Validators.required],
        total: [0, Validators.required],
        metodo_pago: [''],
        estado_pago: ['', Validators.required],
        fecha_pago: ['', Validators.required],

    });

    ngOnInit(): void {

        this.citaSvc.list().subscribe({
            next: (rows) => this.citas.set(rows),
            error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
        if (this.data.mode === 'edit' && this.data.row) {
            const r = this.data.row;

            this.form.patchValue({
                id_cita: r.id_cita,
                total: r.total,
                metodo_pago: r.metodo_pago,
                estado_pago: r.estado_pago,
                fecha_pago: r.fecha_pago,


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
                id_cita: v.id_cita,
                total: v.total,
                metodo_pago: v.metodo_pago,
                estado_pago: v.estado_pago,
                fecha_pago: v.fecha_pago,
                id_usuario_creacion: uid,
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) =>
                    this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });

            return;
        }

        this.svc.update(this.data.row!.id_factura, {
            id_cita: v.id_cita,
            total: v.total,
            metodo_pago: v.metodo_pago,
            estado_pago: v.estado_pago,
            fecha_pago: v.fecha_pago,
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