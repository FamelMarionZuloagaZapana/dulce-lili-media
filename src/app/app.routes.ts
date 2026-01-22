import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { ReclamoComponent } from './reclamo/reclamo.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { BandejaPrincipalComponent } from './bandejaprincipal/bandejaprincipal.component';

export const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'bandejaprincipal', component: BandejaPrincipalComponent },
];
