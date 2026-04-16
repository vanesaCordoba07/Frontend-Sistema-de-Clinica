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

import { EnfermeroService } from '../../core/services/enfermero.service';
import { EnfermeroRead } from '../../models/api.models';
import { shortId } from '../../shared/ids';
import { EnfermeroDialogComponent, EnfermeroDialogData } from './enfermero-dialog';

@Component({
  selector: 'app-enfermero-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.scss',
})
export class EnfermeroListComponent implements AfterViewInit {
  private readonly svc = inject(EnfermeroService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['nombre', 'id_usuario', 'telefono', 'area', 'turno', 'acciones'];
  readonly dataSource = new MatTableDataSource<EnfermeroRead>([]);
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

  editar(row: EnfermeroRead): void {
    this.open({ mode: 'edit', row });
  }

  private open(data: EnfermeroDialogData): void {
    this.dialog
      .open(EnfermeroDialogComponent, { width: '520px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: EnfermeroRead): void {
    if (!confirm(`¿Eliminar enfermero ${row.nombre}?`)) return;
    this.svc.delete(row.id_enfermero).subscribe({
      next: () => {
        this.snack.open('Enfermero eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
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
