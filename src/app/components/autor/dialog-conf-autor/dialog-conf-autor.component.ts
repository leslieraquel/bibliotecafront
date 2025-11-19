import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-conf-autor',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialog-conf-autor.component.html',
  styleUrl: './dialog-conf-autor.component.css'
})
export class DialogConfAutorComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Variables del formulario para autor
  id: string = '';
  name: string = '';
  bio: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  ActualizarOregistrarAutor() {
    // En modo agregar, establecemos las fechas actuales
    if (this.data.modo === 'agregar') {
      this.createdAt = new Date();
      this.updatedAt = new Date();
    } else if (this.data.modo === 'actualizar') {
      // En modo actualizar, updatedAt se actualiza a la fecha actual
      this.updatedAt = new Date();
      // createdAt se mantiene como el valor cargado desde data.autor
    }

    const autorData = {
      id: this.id,
      name: this.name,
      bio: this.bio,
      createdAt: this.createdAt,
      updateAt: this.updatedAt  // Nota: en el dominio es updateAt, no updatedAt
    };

    const baseUrl = 'http://localhost:3000/api/autores/';

    if (this.data.modo === 'agregar') {
      // Validar campos requeridos para agregar
      if (autorData.name && autorData.bio) {
        this.http.post(baseUrl + 'save', autorData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            this.limpiarDatos();
            Swal.fire({
              icon: 'success',
              title: '¡Agregado!',
              text: 'El autor fue agregado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al guardar el autor.',
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
      // Para actualizar
      if (autorData.id && autorData.name && autorData.bio) {
        this.http.put(`${baseUrl}update/${autorData.id}`, autorData).subscribe({
          next: (res) => {
            this.cerrarDialog();
            Swal.fire({
              icon: 'success',
              title: 'Actualizado!',
              text: 'El autor fue actualizado exitosamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al actualizar el autor.',
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
    console.log('Data recibida en el diálogo de autor:', this.data);

    // Si estamos en modo actualizar, cargar los datos del autor
    if (this.data.modo === 'actualizar' && this.data.autor) {
      const autor = this.data.autor;
      this.id = autor.id || '';
      this.name = autor.name || '';
      this.bio = autor.bio || '';
      this.createdAt = autor.createdAt ? new Date(autor.createdAt) : new Date();
      this.updatedAt = autor.updateAt ? new Date(autor.updateAt) : new Date();
    }
  }

  limpiarDatos() {
    this.id = '';
    this.name = '';
    this.bio = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }
}