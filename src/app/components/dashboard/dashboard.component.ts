import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
   constructor(private router: Router) {}

   irALibros() {
    this.router.navigate(['/libro']);
  }
    irAConfigurarLibros() {
    this.router.navigate(['/configurar-libro']);
  }
  
  irAGestion() {
    this.router.navigate(['/gestion']);
  }

    irNiveles() {
    this.router.navigate(['/nivel']);
  }
      irUsuarios() {
    this.router.navigate(['/usuario']);
  }

    irEstudiantes() {
    this.router.navigate(['/estudiante']);
  }
    irAutor() {
    this.router.navigate(['/autor']);
  }

}
