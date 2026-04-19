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

import { EpsService } from '../../core/services/eps.service';
import { EpsRead } from '../../models/api.models';
import { EpsDialogComponent, EpsDialogData } from './eps-dialog';

@Component({
    selector: 'app-eps-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './eps-list.html',
    styleUrl: './eps-list.scss',
})
export class EpsListComponent implements AfterViewInit {
    private readonly svc = inject(EpsService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = ['nombre', 'correo', 'telefono', 'direccion', 'ciudad', 'acciones'];
    readonly dataSource = new MatTableDataSource<EpsRead>([]);
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

    editar(row: EpsRead): void {
        this.open({ mode: 'edit', row });
    }

    private open(data: EpsDialogData): void {
        this.dialog.open(EpsDialogComponent, { width: '560px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    eliminar(row: EpsRead): void {
        if (!confirm(`¿Eliminar EPS ${row.nombre}?`)) return;

        this.svc.delete(row.id_eps).subscribe({
            next: () => {
                this.snack.open('EPS eliminada', 'OK', { duration: 3000 });
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