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
import { UsuarioService } from '../../core/services/usuario.service';
import { EnfermeroService } from '../../core/services/enfermero.service';
import { EnfermeroRead, UsuarioRead} from '../../models/api.models';

export interface EnfermeroDialogData {
  mode: 'create' | 'edit';
  row?: EnfermeroRead;
}

@Component({
  selector: 'app-enfermero-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './enfermero-dialog.html',
})
export class EnfermeroDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EnfermeroService);
  private readonly catSvc = inject(EnfermeroService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<EnfermeroDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EnfermeroDialogData>(MAT_DIALOG_DATA);

  readonly usuarios = signal<EnfermeroRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', Validators.required],
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    area: ['', Validators.required],
    turno: ['', Validators.required],
  });

  ngOnInit(): void {
    this.catSvc.list().subscribe({
      next: (rows) => this.usuarios.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        telefono: r.telefono,
        area: r.area,
        turno: r.turno,
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
          id_usuario: v.id_usuario,
          nombre: v.nombre,
          telefono: v.telefono,
          area: v.area,
          turno: v.turno,
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
      return;
    }
    this.svc
      .update(this.data.row!.id_enfermero, {
        id_usuario: v.id_usuario,
        nombre: v.nombre,
        telefono: v.telefono,
        area: v.area,
        turno: v.turno,
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
 