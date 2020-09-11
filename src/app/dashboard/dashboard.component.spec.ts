import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AsyncRequestService } from "@app/core/services/async-request.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService, AlertService, UserService, ToggleClassService } from "@app/shared/_services/index";

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let asyncRequestService : AsyncRequestService;
  let httpTestingController : HttpTestingController;
  let notifierService : AlertService ;
  let userService: any ;
  let cookieService: any;
  let toggleClassService: any;
  let LocalStorageService: any

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports:[ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ],
      providers:[
        {provide: AsyncRequestService, useValue: asyncRequestService},
        { provide: HttpTestingController, useValue: httpTestingController },
        { provide: UserService, useValue: userService },
        { provide: AlertService, usevalue: notifierService },
        // { provide: CookieService, useValue: cookieService },
        { provide: ToggleClassService, useValue: toggleClassService },
        { provide: LocalStorageService, useValue: LocalStorageService },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
