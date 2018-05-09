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

import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DetailsComponent } from './components/details/details.component';
import { DisableDirective } from './directives/disable.directive';

const appRoutes: Routes = [
  {
    path: '', redirectTo: 'register', pathMatch: 'full'
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxElectronModule,
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
  providers: [Globals, MasterService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
