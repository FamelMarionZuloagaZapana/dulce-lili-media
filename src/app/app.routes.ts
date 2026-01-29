import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { ReclamoComponent } from './reclamo/reclamo.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { BandejaPrincipalComponent } from './bandejaprincipal/bandejaprincipal.component';
import { VistacorreoComponent } from './vistacorreo/vistacorreo.component';
import { TerminoscondicionesComponent } from './principal/terminoscondiciones/terminoscondiciones.component';
import { PoliticasprivacidadComponent } from './principal/politicasprivacidad/politicasprivacidad.component';
import { PoliticacookiesComponent } from './principal/politicacookies/politicacookies.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'bandejaprincipal', component: BandejaPrincipalComponent, canActivate: [AuthGuard] },
  { path: 'vistacorreo/:id', component: VistacorreoComponent, canActivate: [AuthGuard] },
  { path: 'terminos', component: TerminoscondicionesComponent },
  { path: 'privacidad', component: PoliticasprivacidadComponent },
  { path: 'cookies', component: PoliticacookiesComponent },
];
