/** Contratos alineados con `src/api/*.py` del backend FastAPI. */

export interface UsuarioRead {
  id_usuario: string;
  nombre_completo: string;
  email: string;
  rol: string;
  estado: string;
}

export interface UsuarioCreate {
  nombre_completo: string;
  email: string;
  clave: string;
  rol: string;
  estado?: string;
}

export interface UsuarioUpdate {
  nombre_completo?: string;
  email?: string;
  clave?: string;
  rol?: string;
  estado?: string;
}

export interface EnfermeroRead {
  id_enfermero: string;
  id_usuario: string;
  nombre: string;
  telefono: string;
  area: string;
  turno: string;
}

export interface EnfermeroCreate {
  id_usuario: string;
  nombre: string;
  telefono: string;
  area: string;
  turno: string;
}

export interface EnfermeroUpdate {
  id_usuario?: string;
  nombre?: string;
  telefono?: string;
  area?: string;
  turno?: string;
}

export interface CitaCreate {
  id_paciente: string;
  id_medico: string;
  id_servicio: string;
  fecha_hora: string;
  motivo: string;
  estado: string;
  id_usuario_creacion: string;
}

export interface CitaUpdate {
  id_paciente?: string;
  id_medico?: string;
  id_servicio?: string;
  fecha_hora?: string;
  motivo?: string;
  estado?: string;
  id_usuario_edicion: string;
}

export interface CitaRead {
  id_cita: string;
  id_paciente: string;
  id_medico: string;
  id_servicio: string;
  fecha_hora: string;
  motivo: string;
  estado: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edicion: string | null;
}

export interface HistorialCreate {
  id_cita: string;
  id_enfermero: string;
  diagnostico: string;
  observaciones_medicas: string;
  indicaciones_enfermeria: string;
  observaciones_enfermeria: string;
  id_usuario_creacion: string;
}

export interface HistorialUpdate {
  id_cita?: string;
  id_enfermero?: string;
  diagnostico?: string;
  observaciones_medicas?: string;
  indicaciones_enfermeria?: string;
  observaciones_enfermeria?: string;
  id_usuario_edicion: string;
}

export interface HistorialRead {
  id_historial: string;
  id_cita: string;
  id_enfermero: string;
  diagnostico: string;
  observaciones_medicas: string;
  indicaciones_enfermeria: string;
  observaciones_enfermeria: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edicion: string | null;
}

export interface PacienteCreate {
  id_eps: string;
  id_usuario: string;
  nombre: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  genero: string;
  tipo_afiliacion: string;
  id_usuario_creacion: string;
}

export interface PacienteUpdate {
  id_eps?: string;
  id_usuario?: string;
  nombre?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  genero?: string;
  tipo_afiliacion?: string;
  id_usuario_edicion: string;
}

export interface PacienteRead {
  id_paciente: string;
  id_eps: string;
  id_usuario: string;
  nombre: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  genero: string;
  tipo_afiliacion: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edicion: string | null;
}

export interface FacturaCreate {
  id_cita: string;
  total: number;
  estado_pago: string;
  metodo_pago: string;
  fecha_pago: string;
  id_usuario_creacion: string;
}

export interface FacturaUpdate {
  id_cita?: string;
  total?: number;
  estado_pago?: string;
  metodo_pago?: string;
  fecha_pago?: string;
  id_usuario_edicion: string;
}

export interface FacturaRead {
  id_factura: string;
  id_cita: string;
  total: number;
  estado_pago: string;
  metodo_pago: string;
  fecha_pago: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edicion: string | null;
}

export interface TratamientoCreate {
  id_historial: string;
  nombre_tratamiento: string;
  descripcion: string;
  dosis: string;
  duracion: string;
}

export interface TratamientoUpdate {
  id_historial?: string;
  nombre_tratamiento?: string;
  descripcion?: string;
  dosis?: string;
  duracion?: string;
}

export interface TratamientoRead {
  id_tratamiento: string;
  id_historial: string;
  nombre_tratamiento: string;
  descripcion: string;
  dosis: string;
  duracion: string;
}
export interface EpsCreate {

  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

export interface EpsUpdate {

  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

export interface EpsRead {
  id_eps: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}



export interface ServicioRead {
  id_servicio: string;
  nombre: string;
  descripcion: string;
  costo_base: number;
  estado: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edicion: string | null;
}
export interface ServicioCreate {
  nombre_servicio: string;
  descripcion: string;
  costo_base: number;
  estado: string;
  id_usuario_creacion: string;
}

export interface ServicioUpdate {
  nombre_servicio?: string;
  descripcion?: string;
  costo_base?: number;
  estado?: string;
  id_usuario_edicion: string;
}
export interface EspecialidadRead {
  id_especialidad: string;
  nombre: string;
  descripcion: string;
}

export interface EspecialidadCreate {
  nombre_especialidad: string;
  descripcion: string;
}

export interface EspecialidadUpdate {
  nombre_especialidad?: string;
  descripcion?: string;
}
export interface MedicoRead {
  id_medico: string;
  id_usuario: string;
  id_especialidad: string;
  nombre: string;
  telefono: string;
  licencia: string;
}

export interface MedicoCreate {
  id_usuario: string;
  id_especialidad: string;
  nombre: string;
  telefono: string;
  licencia: string;
  id_usuario_creacion: string;
}

export interface MedicoUpdate {
  id_especialidad?: string;
  nombre?: string;
  telefono?: string;
  licencia?: string;
  id_usuario_edicion: string;
}
