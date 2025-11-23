import { Routes } from '@angular/router';
import { LoginComponent} from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
   { path: '', component: LoginComponent },
   {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      {path: 'libro',loadComponent: () =>import('./components/libro/libro.component').then(m => m.LibroComponent)},
      {path: 'estudiante',loadComponent: () =>import('./components/estudiante/estudiante.component').then(m => m.EstudianteComponent)},
      {path: 'usuario',loadComponent: () =>import('./components/usuario/usuario.component').then(m => m.ConfigurarUsuarioComponent)},
      {path: 'autor',loadComponent: () =>import('./components/autor/autor.component').then(m => m.AutorComponent)},
      {path: 'gestion',loadComponent: () =>import('./components/gestion/gestion.component').then(m => m.GestionComponent)},
      {path: 'configurar-libro',loadComponent: () =>import('./components/configurar-libro/configurar-libro.component').then(m => m.ConfigurarLibroComponent)},
      
    ]
  },
   // Ruta por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard al final
  { path: '**', redirectTo: 'login' }
  
];

