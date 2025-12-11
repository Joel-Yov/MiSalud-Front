export interface HospitalRequest {
  nombre: string;
  descripcion?: string | null;
}

export interface HospitalResponse {
  hospitalId: number;
  nombre: string;
  descripcion?: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface SedeHospitalRequest {
  sede: string;
  ubicacion?: string | null;
  hospitalId: number;
}

export interface SedeHospitalResponse {
  sedeId: number;
  sede: string;
  ubicacion?: string | null;
  hospitalId: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface EspecializacionRequest {
  nombre: string;
  descripcion?: string | null;
}

export interface EspecializacionResponse {
  especializacionId: number;
  nombre: string;
  descripcion?: string | null;
}

export interface DoctorRequest {
  persona: {
    primerNombre: string;
    segundoNombre?: string | null;
    primerApellido: string;
    segundoApellido?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    genero: string;
    numeroTelefono: string;
    urlFotoPerfil?: string | null;
  };
  colegiaturaNumero: string;
  especialidadIds: number[];
  consultorioId: number;
  email: string;
  password: string;
  diasDisponibles: string[];
  horaInicioJornada: string;
  horaFinJornada: string;
  precioConsulta: number;
}

export interface DoctorUpdateRequest {
  persona: {
    primerNombre: string;
    segundoNombre?: string | null;
    primerApellido: string;
    segundoApellido?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    genero: string;
    numeroTelefono: string;
    urlFotoPerfil?: string | null;
  };
  numeroColegiatura?: string | null;
  especialidadIds: number[];
}

export interface DoctorResponse {
  id: number;
  persona: {
    id: number;
    primerNombre: string;
    segundoNombre?: string | null;
    primerApellido: string;
    segundoApellido?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    genero: string;
    numeroTelefono: string;
    urlFotoPerfil?: string | null;
  };
  numeroColegiatura?: string | null;
  especialidadIds: number[] | string[]; //Si logras que en el backend te traigas las especialidades en vez de los IDS por eso le dejo la alternativa de string[]
}

export interface PacienteRequest {
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string; // ISO date (YYYY-MM-DD)
  domicilio?: string | null;
}

export interface PacienteResponse {
  pacienteId: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string; // ISO date (YYYY-MM-DD)
  domicilio?: string | null;
  estaActivo?: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA' | 'NO_ASISTIO';

export type TipoAtencion = 'PRESENCIAL' | 'TELECONSULTA' | 'DOMICILIARIA';

// Mantener compatibilidad con el resto del código que usa los alias anteriores
export type CitaMedicaEstado = EstadoCita;

export type CitaMedicaTipo = TipoAtencion;

export interface CitaRequest {
  doctorId: number;
  pacienteId: number;
  consultorioId: number;
  fechaCita: string; // ISO date (YYYY-MM-DD)
  horaCita: string; // HH:mm:ss
  tipoAtencion: CitaMedicaTipo;
  duracionMinutos: number;
  precioBase: number;
  montoDescuento: number;
  estado: CitaMedicaEstado;
  seguroId?: number;
}

export interface CitaMedicaRequest {
  fecha: string; // ISO date-time
  tipoCita: CitaMedicaTipo;
  estado: CitaMedicaEstado;
  costo: number;
  doctorId: number;
  pacienteId: number;
}

export interface CitaResponse {
  id: number;
  pacienteId: number;
  doctorId: number;
  consultorioId: number;
  fechaCita: string; // YYYY-MM-DD
  horaCita: string; // HH:mm:ss
  duracionMinutos: number;
  estado: CitaMedicaEstado;
  tipoAtencion: CitaMedicaTipo;
  precioBase: number;
  montoDescuento: number;
  costoNetoCita: number;
  seguroId?: number | null;
  nombreSeguro?: string | null;
  copagoEstimado?: number | null;
  nombreCompletoPaciente?: string | null;
  nombreCompletoDoctor?: string | null;
  nombreConsultorio?: string | null;
}

export interface CitaMedicaResponse {
  citaId: number;
  fecha: string; // ISO date-time
  tipoCita: CitaMedicaTipo;
  estado: CitaMedicaEstado;
  costo: number;
  doctorId: number;
  pacienteId: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type UserRole = string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  persona: {
    primerNombre: string;
    segundoNombre?: string | null;
    primerApellido: string;
    segundoApellido?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    genero: string;
    numeroTelefono: string;
    urlFotoPerfil?: string | null;
  };
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

export interface AuthUser {
  id: number;
  email: string;
  rol: UserRole;
  username?: string;
  nombre?: string;
  apellido?: string;
  estaActivo?: boolean;
}

export interface AuthResponse {
  token: string;
  type?: string;
  user: AuthUser;
}

export type AuthSession = AuthResponse;
