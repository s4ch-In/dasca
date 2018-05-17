import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppComponent } from './app.component';
import { Globals } from './globals';
import { MasterService } from './services/master.service';
import { RegisterComponent } from './components/register/register.component';
import { Http, HttpModule } from '@angular/http';
import { NgxElectronModule } from 'ngx-electron';
import { PrintComponent } from './components/print/print.component';
import { ListComponent } from './components/list/list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DetailsComponent } from './components/details/details.component';
import { DisableDirective } from './directives/disable.directive';
import { NumberToWordsPipe } from './components/pipes/number-to-words.pipe';
import { PrintService } from './services/print.service';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';

const appRoutes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'register', component: RegisterComponent,
  },
  {
    path: 'list', component: ListComponent,
  },
  {
    path: 'print', component: PrintComponent,
  },
  {
    path: 'details', component: DetailsComponent,
  }
]
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PrintComponent,
    ListComponent,
    DetailsComponent,
    DisableDirective,
    NumberToWordsPipe,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxElectronModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
      // { enableTracing: true } // <-- debugging purposes only
    ),
    // ToastModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HttpModule
  ],
  providers: [Globals, MasterService, DatePipe, PrintService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
