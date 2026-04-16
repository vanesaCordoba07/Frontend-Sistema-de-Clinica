import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { AuditContextService } from '../../core/audit-context.service';
import { MedicoService } from '../../core/medico.service';
import { EspecialidadService } from '../../core/especialidad.service';
import { MedicoRead, EspecialidadRead, MedicoCreate, MedicoUpdate } from '../../models/api.models';

export interface MedicoDialogData {
    mode: 'create' | 'edit';
    row?: MedicoRead;
}

@Component({
    selector: 'app-medico-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    templateUrl: './medico-dialog.html',
    styleUrl: './medico-dialog.scss'
})
export class MedicoDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private medicoSvc = inject(MedicoService);
    private espSvc = inject(EspecialidadService);
    private auditSvc = inject(AuditContextService);
    private snack = inject(MatSnackBar);
    private dialogRef = inject(MatDialogRef<MedicoDialogComponent>);
    data = inject<MedicoDialogData>(MAT_DIALOG_DATA);

    especialidades = signal<EspecialidadRead[]>([]);

    form: FormGroup = this.fb.group({
        id_usuario: ['', Validators.required],
        id_especialidad: ['', Validators.required],
        nombre: ['', Validators.required],
        telefono: ['', Validators.required],
        licencia: ['', Validators.required]
    });

    ngOnInit(): void {
        this.espSvc.list().subscribe({
            next: (rows: EspecialidadRead[]) => {
                this.especialidades.set(rows);
            },
            error: (err: HttpErrorResponse) => {
                this.snack.open(this.msg(err), 'Cerrar');
            }
        });

        if (this.data.mode === 'edit' && this.data.row) {
            this.form.patchValue({
                id_usuario: this.data.row.id_usuario,
                id_especialidad: this.data.row.id_especialidad,
                nombre: this.data.row.nombre,
                telefono: this.data.row.telefono,
                licencia: this.data.row.licencia
            });
        }
    }

    save(): void {
        if (this.form.invalid) return;

        const user = (this.auditSvc as any).getUser?.() || (this.auditSvc as any).user;
        if (!user) return;

        if (this.data.mode === 'create') {
            const payload: MedicoCreate = {
                ...this.form.value,
                id_usuario_creacion: user.id_usuario
            };

            this.medicoSvc.create(payload).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar')
            });
        } else {
            const payload: MedicoUpdate = {
                ...this.form.value,
                id_usuario_edicion: user.id_usuario
            };

            if (this.data.row?.id_medico) {
                this.medicoSvc.update(this.data.row.id_medico, payload).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar')
                });
            }
        }
    }

    private msg(err: HttpErrorResponse): string {
        return err.error?.message || 'Error en la operación';
    }
}