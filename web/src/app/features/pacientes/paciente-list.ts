import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { PacienteDialogComponent } from './paciente-dialog';
import { PacienteDialogData } from './paciente-dialog';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteRead } from '../../models/api.models';

@Component({
    selector: 'app-paciente-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './paciente-list.html',
    styleUrl: './paciente-list.scss',
})
export class PacienteListComponent implements AfterViewInit {
    private readonly svc = inject(PacienteService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'id_usuario',
        'nombre',
        'telefono',
        'fecha_nacimiento',
        'direccion',
        'genero',
        'tipo_afiliacion'

    ];

    readonly dataSource = new MatTableDataSource<PacienteRead>([]);
    loading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    constructor() {
        this.reload();
    }

    reload(): void {
        this.loading = true;
        this.svc.list().subscribe({
            next: (rows) => {
                this.dataSource.data = rows;
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.loading = false;
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
            },
        });
    }

    nuevo(): void {
        this.open({ mode: 'create' });
    }

    editar(row: PacienteRead): void {
        this.open({ mode: 'edit', row });
    }

    private open(data: PacienteDialogData): void {
        this.dialog.open(PacienteDialogComponent, { width: '560px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    eliminar(row: PacienteRead): void {
        if (!confirm(`¿Eliminar paciente ${row.id_paciente}?`)) return;

        this.svc.delete(row.id_paciente).subscribe({
            next: () => {
                this.snack.open('Paciente eliminado', 'OK', { duration: 3000 });
                this.reload();
            },
            error: (err: HttpErrorResponse) =>
                this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
    }

    private msg(err: HttpErrorResponse): string {
        return err.message;
    }
}