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

import { TratamientoService } from '../../core/services/tratamiento.service';
import { TratamientoRead } from '../../models/api.models';
import { shortId } from '../../shared/ids';
import {
    TratamientoDialogComponent,
    TratamientoDialogData
} from './tratamiento-dialog';

@Component({
    selector: 'app-tratamiento-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './tratamiento-list.html',
    styleUrl: './tratamiento-list.scss',
})
export class TratamientoListComponent implements AfterViewInit {
    private readonly svc = inject(TratamientoService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'nombre_tratamiento',
        'descripcion',
        'dosis',
        'duracion',
        'id_historial',
        'acciones'
    ];

    readonly dataSource = new MatTableDataSource<TratamientoRead>([]);
    loading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    constructor() {
        this.reload();
    }

    shortId = shortId;

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

    editar(row: TratamientoRead): void {
        this.open({ mode: 'edit', row });
    }

    private open(data: TratamientoDialogData): void {
        this.dialog.open(TratamientoDialogComponent, {
            width: '560px',
            data
        })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    eliminar(row: TratamientoRead): void {
        if (!confirm(`¿Eliminar tratamiento ${row.nombre_tratamiento}?`)) return;

        this.svc.delete(row.id_tratamiento).subscribe({
            next: () => {
                this.snack.open('Tratamiento eliminado', 'OK', { duration: 3000 });
                this.reload();
            },
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