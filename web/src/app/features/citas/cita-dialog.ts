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
import { PacienteService } from '../../core/services/paciente.service';
import { MedicoService } from '../../core/services/medico.service';
import { ServicioService } from '../../core/services/servicio.service';
import { CitaService } from '../../core/services/cita.service';
import { CitaRead, PacienteRead, MedicoRead, ServicioRead } from '../../models/api.models';

export interface CitaDialogData {
  mode: 'create' | 'edit';
  row?: CitaRead;
}

@Component({
  selector: 'app-cita-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './cita-dialog.html',
})
export class CitaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CitaService);
  private readonly catSvc = inject(CitaService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<CitaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<CitaDialogData>(MAT_DIALOG_DATA);

  readonly pacientes = signal<PacienteRead[]>([]);
  readonly medicos = signal<MedicoRead[]>([]);
  readonly servicios = signal<ServicioRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_paciente: ['', Validators.required],
    id_medico: ['', Validators.required],
    id_servicio: ['', Validators.required],
    fecha_hora: ['', Validators.required],
    motivo: [''],
    estado: [''],
  });

  ngOnInit(): void {
    this.catSvc.list().subscribe({
      next: (rows) => this.pacientes.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_paciente: r.id_paciente,
        id_medico: r.id_medico,
        id_servicio: r.id_servicio,
        fecha_hora: r.fecha_hora,
        motivo: r.motivo,
        estado: r.estado,
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
          id_paciente: v.id_paciente,
          id_medico: v.id_medico,
          id_servicio: v.id_servicio,
          fecha_hora: v.fecha_hora,
          motivo: v.motivo,
          estado: v.estado,
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
        id_paciente: v.id_paciente,
        id_medico: v.id_medico,
        id_servicio: v.id_servicio,
        fecha_hora: v.fecha_hora,
        motivo: v.motivo,
        estado: v.estado,
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
 