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

import { FacturaService } from '../../core/services/factura.service';
import { FacturaRead } from '../../models/api.models';
import { FacturaDialogComponent, FacturaDialogData } from './factura-dialog';

@Component({
    selector: 'app-factura-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './factura-list.html',
    styleUrl: './factura-list.scss',
})
export class FacturaListComponent implements AfterViewInit {
    private readonly svc = inject(FacturaService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'id_cita',
        'total',
        'metodo_pago',
        'estado_pago',
        'fecha_pago',
        'acciones'
    ];

    readonly dataSource = new MatTableDataSource<FacturaRead>([]);
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

    editar(row: FacturaRead): void {
        this.open({ mode: 'edit', row });
    }

    private open(data: FacturaDialogData): void {
        this.dialog.open(FacturaDialogComponent, { width: '560px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    eliminar(row: FacturaRead): void {
        if (!confirm(`¿Eliminar factura ${row.id_cita}?`)) return;

        this.svc.delete(row.id_factura).subscribe({
            next: () => {
                this.snack.open('Factura eliminada', 'OK', { duration: 3000 });
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