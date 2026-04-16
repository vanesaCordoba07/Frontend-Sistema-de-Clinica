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
import { CitaService } from '../../core/services/cita.service';
import { EnfermeroService } from '../../core/services/enfermero.service';
import { HistorialService } from '../../core/services/historial.service';
import { CitaRead, HistorialRead, EnfermeroRead} from '../../models/api.models';

export interface HistorialDialogData {
  mode: 'create' | 'edit';
  row?: HistorialRead;
}

@Component({
  selector: 'app-historial-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './historial-dialog.html',
})
export class HistorialDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(HistorialService);
  private readonly catSvc = inject(HistorialService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<HistorialDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<HistorialDialogData>(MAT_DIALOG_DATA);

  readonly citas = signal<CitaRead[]>([]);
  readonly enfermeros = signal<EnfermeroRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_cita : ['', Validators.required],
    id_enfermero: ['', Validators.required],
    diagnostico: [''],
    observaciones_medicas: [''],
    indicaciones_enfermeria: [''],
    observaciones_enfermeria: [''],
  });

  ngOnInit(): void {
    this.catSvc.list().subscribe({
      next: (rows) => this.citas.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_cita: r.id_cita,
        id_enfermero: r.id_enfermero,
        diagnostico: r.diagnostico,
        observaciones_medicas: r.observaciones_medicas,
        indicaciones_enfermeria: r.indicaciones_enfermeria,
        observaciones_enfermeria: r.observaciones_enfermeria,
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
      this.svc
        .create({
          id_cita: v.id_cita,
          id_enfermero: v.id_enfermero,
          diagnostico: v.diagnostico,
          observaciones_medicas: v.observaciones_medicas,
          indicaciones_enfermeria: v.indicaciones_enfermeria,
          observaciones_enfermeria: v.observaciones_enfermeria,
          id_usuario_creacion: uid,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    this.svc
      .update(this.data.row!.id_cita, {
        id_cita: v.id_cita,
        id_enfermero: v.id_enfermero,
        diagnostico: v.diagnostico,
        observaciones_medicas: v.observaciones_medicas,
        indicaciones_enfermeria: v.indicaciones_enfermeria,
        observaciones_enfermeria: v.observaciones_enfermeria,
        id_usuario_edicion: uid,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
 