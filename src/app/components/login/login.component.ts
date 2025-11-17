import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 loginData = {
    ci: '',
    password: ''
  };
  constructor(private http: HttpClient, private router: Router,private toastr:ToastrService) {}
  cargando:boolean = false;

  onSubmit() {
    this.cargando = true;

    console.log(this.loginData);
    this.http.post<any>('http://localhost:3000/api/auth/login', this.loginData)
    .subscribe({
        next: (res) => {
          this.cargando = false;
          localStorage.setItem('token', res.token);
          this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
          this.router.navigate(['/dashboard']);  // redirige al dashboard
          console.log(res.token);
        },
        error: (err) => {
          this.cargando = false;
          this.toastr.error('Clave o usuario incorrectos', '');
        }
      });
  }

}
