import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { GenerarQrComponent } from './generar-qr.component';
import { CitaCard } from '../../citas.component';

describe('GenerarQrComponent', () => {
  let component: GenerarQrComponent;
  let fixture: ComponentFixture<GenerarQrComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  const mockCita: CitaCard = {
    id: 1,
    pacienteId: 2,
    doctorId: 3,
    consultorioId: 4,
    fechaCita: '2024-05-10',
    horaCita: '09:00:00',
    duracionMinutos: 30,
    estado: 'CONFIRMADA',
    tipoAtencion: 'PRESENCIAL',
    precioBase: 120,
    montoDescuento: 0,
    costoNetoCita: 120,
    nombreCompletoPaciente: 'Juan Pérez',
    nombreCompletoDoctor: 'Dra. Ana Gómez',
    nombreConsultorio: 'Consultorio 101',
    nombreSeguro: 'Seguro Salud',
    copagoEstimado: 15,
    seguroId: 1
  };

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      imports: [GenerarQrComponent],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarQrComponent);
    component = fixture.componentInstance;
    component.cita = mockCita;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
