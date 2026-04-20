import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { ServicioService } from '../../core/servicio.service';
import { ServicioRead } from '../../models/api.models';
import { ServicioDialogComponent, ServicioDialogData } from './servicio-dialog';

@Component({
    selector: 'app-servicio-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        CurrencyPipe,
    ],
    templateUrl: './servicio-list.html',
    styleUrl: './servicio-list.scss',
})
export class ServicioListComponent implements AfterViewInit {
    private readonly svc = inject(ServicioService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = ['nombre', 'descripcion', 'costo_base', 'acciones'];
    readonly dataSource = new MatTableDataSource<ServicioRead>([]);
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

    editar(row: ServicioRead): void {
        this.open({ mode: 'edit', row });
    }

    private open(data: ServicioDialogData): void {
        this.dialog
            .open(ServicioDialogComponent, { width: '520px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    eliminar(row: ServicioRead): void {
        if (!confirm(`¿Eliminar el servicio ${row.nombre_servicio}?`)) return;
        this.svc.delete(row.id_servicio).subscribe({
            next: () => {
                this.snack.open('Servicio eliminado', 'OK', { duration: 3000 });
                this.reload();
            },
            error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
        });
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;
        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
        return err.message;
    }
}