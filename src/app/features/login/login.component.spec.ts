import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    const routerStub = { navigateByUrl: jasmine.createSpy('navigateByUrl') } as Partial<Router>;
    const authServiceStub = {
      login: () => of({ token: 'token', type: 'Bearer', user: { id: 1, email: 'test@example.com', rol: 'ADMIN' } }),
    } as Partial<AuthService>;
    const activatedRouteStub = {
      snapshot: { queryParamMap: convertToParamMap({}) },
    } as Partial<ActivatedRoute>;

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), LoginComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
