import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-conf-usuario',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialog-conf-usuario.component.html',
  styleUrl: './dialog-conf-usuario.component.css'
})
export class DialogConfUsuarioComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Variables del formulario para usuario
  ci: string = '';
  tipoSeleccionado: string = '';
  nombre: string = '';
  email: string = '';
  password: string = '';

  ActualizarOregistrarUsuario() {
    const usuarioData = {
      ci: this.ci,
      type: this.tipoSeleccionado,
      name: this.nombre,
      email: this.email,
      password: this.password
    };

    const baseUrl = 'http://localhost:3000/api/usuario/';

    if (this.data.modo === 'agregar') {
      // Validar campos requeridos para agregar
      if (usuarioData.ci && usuarioData.type && usuarioData.name && usuarioData.email && usuarioData.password) {
        this.http.post(baseUrl + 'save', usuarioData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            this.limpiarDatos();
            Swal.fire({
              icon: 'success',
              title: '¡Agregado!',
              text: 'El usuario fue agregado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al guardar el usuario.',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, complete todos los campos requeridos.',
          confirmButtonText: 'Aceptar'
        });
      }
    } else if (this.data.modo === 'actualizar') {
      // Para actualizar, no requerimos password
      if (usuarioData.ci && usuarioData.type && usuarioData.name && usuarioData.email) {
        this.http.put(`${baseUrl}update/${usuarioData.ci}`, usuarioData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            Swal.fire({
              icon: 'success',
              title: 'Actualizado!',
              text: 'El usuario fue actualizado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al actualizar el usuario.',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, complete todos los campos requeridos.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }

  ngOnInit() {
    console.log('Data recibida en el diálogo de usuario:', this.data);

    // Si estamos en modo actualizar, cargar los datos del usuario
    if (this.data.modo === 'actualizar' && this.data.usuario) {
      const usuario = this.data.usuario;
      this.ci = usuario.ci || '';
      this.tipoSeleccionado = usuario.type || '';
      this.nombre = usuario.name || '';
      this.email = usuario.email || '';
      // No cargamos el password por seguridad
    }
  }

  limpiarDatos() {
    this.ci = '';
    this.tipoSeleccionado = '';
    this.nombre = '';
    this.email = '';
    this.password = '';
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }
}