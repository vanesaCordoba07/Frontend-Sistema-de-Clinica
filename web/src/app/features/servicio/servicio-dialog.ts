import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ServicioService } from '../../core/services/servicio.service';
import { ServicioRead } from '../../models/api.models';

export interface ServicioDialogData {
    mode: 'create' | 'edit';
    row?: ServicioRead;
}

@Component({
    selector: 'app-servicio-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
    templateUrl: './servicio-dialog.html'
})
export class ServicioDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private svc = inject(ServicioService);
    private snack = inject(MatSnackBar);
    private dialogRef = inject(MatDialogRef<ServicioDialogComponent>);
    data = inject<ServicioDialogData>(MAT_DIALOG_DATA);

    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: [''],
        costo_base: [0, [Validators.required, Validators.min(0)]],
        estado: ['Activo']
    });

    ngOnInit(): void {
        if (this.data.mode === 'edit' && this.data.row) {
            this.form.patchValue(this.data.row);
        }
    }

    save(): void {
        if (this.form.invalid) return;

        if (this.data.mode === 'create') {
            this.svc.create(this.form.value).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open('Error al crear', 'Cerrar')
            });
        }
    }

    private msg(err: HttpErrorResponse): string {
        return err.error?.message || 'Error';
    }
}