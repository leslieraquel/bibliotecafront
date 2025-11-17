import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
   constructor(private router: Router) {}


    irModulos() {
    this.router.navigate(['/dashboard']);
  }

    irLogin() {
    this.router.navigate(['/login']);
  }

}
