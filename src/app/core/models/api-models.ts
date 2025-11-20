export interface Hospital {
  hospitalId?: number;
  nombre: string;
  descripcion?: string | null;
  sedes?: SedeHospital[];
}

export interface SedeHospital {
  sedeId?: number;
  sede: string;
  ubicacion?: string | null;
  hospital?: Hospital | number;
  doctores?: Doctor[];
}

export interface Especializacion {
  especializacionId?: number;
  nombre: string;
  descripcion?: string | null;
  doctores?: Doctor[];
}

export interface Doctor {
  doctorId?: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido: string;
  sedeHospital?: SedeHospital | number;
  citas?: CitaMedica[];
  especializaciones?: Especializacion[] | number[];
}

export interface Paciente {
  pacienteId?: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string; // ISO date (YYYY-MM-DD)
  domicilio?: string | null;
  estaActivo?: boolean;
  fechaCreacion?: string; // ISO date-time
  citas?: CitaMedica[];
}

export interface CitaMedica {
  citaId?: number;
  fecha: string; // ISO date-time
  costo: string; // decimal string
  doctor: Doctor | number;
  paciente: Paciente | number;
}

export interface HospitalResponse {
  mensaje: string;
  hospital?: Hospital;
  error?: string;
}

export interface DeleteResponse { [k: string]: boolean; }
