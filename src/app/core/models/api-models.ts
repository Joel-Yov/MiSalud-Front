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
  especialidadId: number;
  consultorioId: number;
  email: string;
  password: string;
  diasDisponibles: string[];
  horaInicioJornada: string;
  horaFinJornada: string;
  precioConsulta: number;
}

export interface DoctorResponse {
  doctorId: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido: string;
  sedeId: number;
  turnoId: number;
  estaActivo?: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  especializacionIds: number[];
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

export type CitaMedicaEstado = string;

export type CitaMedicaTipo = string;

export interface CitaMedicaRequest {
  fecha: string; // ISO date-time
  tipoCita: CitaMedicaTipo;
  estado: CitaMedicaEstado;
  costo: number;
  doctorId: number;
  pacienteId: number;
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
  username: string;
  email: string;
  password: string;
  confirmarPassword: string;
  nombre: string;
  apellido: string;
  rol?: UserRole;
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
