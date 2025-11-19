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
  selector: 'app-dialog-conf-estudiante',
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
  templateUrl: './dialog-estudiante.component.html',

  styleUrl: './dialog-estudiante.component.css'

})
export class DialogEstudianteComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Variables del formulario para estudiante
  id: string = '';
  nombre: string = '';
  email: string = '';
  carrera: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  ActualizarOregistrarEstudiante() {
    const estudianteData = {
      id: this.id,
      name: this.nombre,
      email: this.email,
      carrera: this.carrera,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    const baseUrl = 'http://localhost:3000/api/estudiante/';

    if (this.data.modo === 'agregar') {
      // Validar campos requeridos para agregar
      if (estudianteData.id && estudianteData.name && estudianteData.email && estudianteData.carrera) {
        this.http.post(baseUrl + 'save', estudianteData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            this.limpiarDatos();
            Swal.fire({
              icon: 'success',
              title: '¡Agregado!',
              text: 'El estudiante fue agregado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al guardar el estudiante.',
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
      if (estudianteData.id && estudianteData.name && estudianteData.email && estudianteData.carrera) {
        this.http.put(`${baseUrl}update/${estudianteData.id}`, estudianteData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            Swal.fire({
              icon: 'success',
              title: 'Actualizado!',
              text: 'El estudiante fue actualizado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al actualizar el estudiante.',
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
    console.log('Data recibida en el diálogo de estudiante:', this.data);

    // Si estamos en modo actualizar, cargar los datos del estudiante
    if (this.data.modo === 'actualizar' && this.data.estudiante) {
      const estudiante = this.data.estudiante;
      this.id = estudiante.id || '';
      this.nombre = estudiante.name || '';
      this.email = estudiante.email || '';
      this.carrera = estudiante.carrera || '';
      this.createdAt = estudiante.createdAt || new Date();
      this.updatedAt = new Date(); // Actualizar la fecha de modificación
    }
  }

  limpiarDatos() {
    this.id = '';
    this.nombre = '';
    this.email = '';
    this.carrera = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }
}