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


export interface AutorData {
  id: string;
  name: string;
  bio: string;
}

@Component({
  selector: 'app-dialog-conf-autor',
  standalone: true,
  imports: [
   MatFormFieldModule,
      MatInputModule,
      HttpClientModule,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,
      MatCardModule,
      CommonModule,
      MatDialogModule,
      FormsModule,
      ReactiveFormsModule,
      MatSelectModule,
  ],
  templateUrl: './dialog-conf-autor.component.html',
  styleUrl: './dialog-conf-autor.component.css'
})
export class DialogConfAutorComponent implements OnInit {
  mostrarCard: boolean = false;
  
  constructor(
    public dialog: MatDialog,
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Variables del formulario para autor
  id: any;
  name: any;
  bio: any;

  ActualizarOregistrarAutor() {
  const url = 'http://localhost:3000/api/autor/';

  let nuevoAutor = {
    id: this.id,
    name: this.name,
    bio: this.bio
  };

  console.log(nuevoAutor);

  if (this.data.modo === 'editar') {
    // Usar PUT para actualizar
    this.http.put(url + 'update', nuevoAutor).subscribe({
      next: (res) => {
        this.cerrarDialog();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado!',
          text: 'El registro fue actualizado exitosamente.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al guardar los datos.',
        });
      }
    });
  } else {
    // Usar POST para crear
    this.http.post(url + 'save', nuevoAutor).subscribe({
      next: (res) => {
        this.cerrarDialog();
        this.limpiarDatos();
        Swal.fire({
          icon: 'success',
          title: '¡Agregado!',
          text: 'El registro fue agregado exitosamente.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al guardar los datos.',
        });
      }
    });
  }
}


  ngOnInit() {
    console.log('Data recibida en el diálogo de autor:', this.data);

    // Si estamos en modo actualizar, cargar los datos del autor
    if (this.data.modo === 'editar' && this.data.autor) {
      const autor = this.data.autor;
      this.id = autor.id || '';
      this.name = autor.name || '';
      this.bio = autor.bio || '';
    }
  }

  limpiarDatos() {
    this.id = '';
    this.name = '';
    this.bio = '';
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }
}