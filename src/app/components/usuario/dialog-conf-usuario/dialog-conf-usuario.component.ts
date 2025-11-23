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

export interface UserData {
  id: string;
  ci: string;
  typeSelect: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-configurar-usuario',
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
  templateUrl: './dialog-conf-usuario.component.html',
  styleUrl: './dialog-conf-usuario.component.css',
})
export class DialogConfUsuarioComponent implements OnInit {
  mostrarCard: boolean = false;
  constructor(public dialog: MatDialog,private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ci: any;
  typeSelect: any;
  name: any;
  email: any;
  password: any;
  createdAt: any;
  updateAt: any;

  ActualizarOregistrarUsuario() {
  const url = 'http://localhost:3000/api/users/';
  
    let nuevoUsuario = {
      ci: this.ci,
      type: this.typeSelect,
      name: this.name,
      email: this.email,
      password: this.password
    };
     console.log(nuevoUsuario);

  // Validar campos requeridos
  if (!this.ci?.trim()) {
    Swal.fire('Error', 'El CI es requerido', 'warning');
    return;
  }

  if (!this.name?.trim()) {
    Swal.fire('Error', 'El nombre es requerido', 'warning');
    return;
  }

  if (!this.email?.trim()) {
    Swal.fire('Error', 'El email es requerido', 'warning');
    return;
  }

  if (this.data.modo === 'editar') {
    this.http.put(url + 'update/' + this.ci, nuevoUsuario).subscribe({
      next: (res) => {
        this.cerrarDialog();
        Swal.fire({
          icon: 'success',
          title: '¡Agregado!',
          text: 'El registro fue agregado exitosamente.',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al guardar los datos.',
        });
      },
    });

  } else {
    this.http.post(url + 'save', nuevoUsuario).subscribe({
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
    console.log('Data recibida en el diálogo:', this.data);

    if (this.data.modo === 'editar' && this.data.usuario) {
      const it = this.data.usuario;
      this.ci = it.ci;
      this.typeSelect =this.typeSelect;
      this.name = it.isbn;
      this.email = it.estado;
      this.password = it.password;
    }
  }
    limpiarDatos() {
    this.ci = '';
    this.typeSelect = '';
    this.name = '';
    this.email = '';
    this.password = '';
  }
    cerrarDialog() {
    this.dialog.closeAll();
  }
}
