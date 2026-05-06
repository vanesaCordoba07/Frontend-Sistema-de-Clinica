import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
    },
    {
        path: 'app',
        canActivate: [auditUserGuard],
        loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
        children: [
            { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
            {
                path: 'usuarios',
                loadComponent: () =>
                    import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
            },
            {
                path: 'citas',
                loadComponent: () =>
                    import('./features/citas/cita-list').then((m) => m.CitaListComponent),
            },
            {
                path: 'enfermeros',
                loadComponent: () =>
                    import('./features/enfermeros/enfermero-list').then((m) => m.EnfermeroListComponent),
            },
            {
                path: 'historiales',
                loadComponent: () =>
                    import('./features/historiales/historial-list').then((m) => m.HistorialListComponent),
            },
            {
                path: 'eps',
                loadComponent: () =>
                    import('./features/eps/eps-list').then((m) => m.EpsListComponent),
            },
            {
                path: 'facturas',
                loadComponent: () =>
                    import('./features/facturas/factura-list').then((m) => m.FacturaListComponent),
            },
            {
                path: 'pacientes',
                loadComponent: () =>
                    import('./features/pacientes/paciente-list').then((m) => m.PacienteListComponent),
            },
            {
                path: 'tratamientos',
                loadComponent: () =>
                    import('./features/tratamientos/tratamiento-list').then((m) => m.TratamientoListComponent),
            },
            {
                path: 'medicos',
                loadComponent: () =>
                    import('.//features/medico/medico-list').then((m) => m.MedicoListComponent),
            },
            {
                path: 'servicios',
                loadComponent: () =>
                    import('./features/servicio/servicio-list').then((m) => m.ServicioListComponent),
            },
            {
                path: 'especialidades',
                loadComponent: () =>
                    import('./features/especialidad/especialidad-list').then((m) => m.EspecialidadListComponent),
            },
        ],
    },
    { path: '**', redirectTo: 'login' },
];