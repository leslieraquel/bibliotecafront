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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface UserData {
  id: string;
  ci: string;
  type: string;
  typeperfil: string;
  name: string;
  email: string;
  password: string;
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog-conf-usuario.component.html',
  styleUrl: './dialog-conf-usuario.component.css',
})
export class DialogConfUsuarioComponent implements OnInit {
  mostrarCard: boolean = false;
  
  // DEFINIR LA EXPRESIÓN REGULAR PARA CÉDULA
  readonly CEDULA_10 = /^\d{10}$/;
  readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  readonly NOMBRE_REGEX = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{2,50}$/;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ci: any;
  type: any;
  typeperfil: any;
  name: any;
  email: any;
  password: any;
  createdAt: any;
  updateAt: any;

  // Variables para validación de cédula única
  cedulaChecking = false;
  cedulaExists = false;
  cedulaValid = true;
  cedulaOriginal: string = '';
  
  // Variables para validación de nombre único
  nombreChecking = false;
  nombreExists = false;
  nombreValid = true;
  nombreOriginal: string = '';
  
  // Variables para validación de formato
  nombreInvalid = false;
  emailInvalid = false;
  passwordInvalid = false;

  // MÉTODO PARA VALIDAR NOMBRE EN TIEMPO REAL
  validateNombre(): void {
    if (!this.name) {
      this.nombreExists = false;
      this.nombreValid = true;
      this.nombreInvalid = false;
      return;
    }

    // Validar formato primero
    if (!this.NOMBRE_REGEX.test(this.name)) {
      this.nombreValid = false;
      this.nombreExists = false;
      this.nombreInvalid = true;
      return;
    }

    this.nombreValid = true;
    this.nombreInvalid = false;
    
    // No validar si estamos en modo edición y el nombre no ha cambiado
    if (this.data.modo === 'editar' && this.name === this.nombreOriginal) {
      this.nombreExists = false;
      return;
    }

    this.nombreChecking = true;

    // Llamar al backend para verificar si el nombre existe
    const nombreCodificado = encodeURIComponent(this.name.trim());
    this.http.get<{ exists: boolean }>(`http://localhost:3000/api/users/check-name/${nombreCodificado}`)
      .subscribe({
        next: (response) => {
          this.nombreChecking = false;
          this.nombreExists = response.exists;
          
          if (this.nombreExists) {
            this.mostrarMensajeNombreDuplicado();
          }
        },
        error: (error) => {
          this.nombreChecking = false;
          console.error('Error al verificar nombre:', error);
        }
      });
  }

  private mostrarMensajeNombreDuplicado(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Nombre duplicado',
      text: 'El nombre ingresado ya está registrado en el sistema.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  // VALIDAR CÉDULA EN TIEMPO REAL
  validateCedula(): void {
    if (!this.ci) {
      this.cedulaExists = false;
      this.cedulaValid = true;
      return;
    }

    // Validar formato primero
    if (!this.CEDULA_10.test(this.ci)) {
      this.cedulaValid = false;
      this.cedulaExists = false;
      return;
    }

    this.cedulaValid = true;
    
    // No validar si estamos en modo edición y la cédula no ha cambiado
    if (this.data.modo === 'editar' && this.ci === this.cedulaOriginal) {
      this.cedulaExists = false;
      return;
    }

    this.cedulaChecking = true;

    // Llamar al backend para verificar si la cédula existe
    this.http.get<{ exists: boolean }>(`http://localhost:3000/api/users/check-ci/${this.ci}`)
      .subscribe({
        next: (response) => {
          this.cedulaChecking = false;
          this.cedulaExists = response.exists;
          
          // Mostrar mensaje inmediato si la cédula ya existe
          if (this.cedulaExists) {
            this.mostrarMensajeCedulaDuplicada();
          }
        },
        error: (error) => {
          this.cedulaChecking = false;
          console.error('Error al verificar cédula:', error);
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'No se pudo verificar la cédula. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  private mostrarMensajeCedulaDuplicada(): void {
    Swal.fire({
      icon: 'error',
      title: 'Cédula duplicada',
      text: 'La cédula ingresada ya está registrada en el sistema. Por favor, ingrese una cédula diferente.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true
    });
  }

  // MÉTODOS DE VALIDACIÓN DE FORMATO
  validateEmail(): void {
    if (!this.email) {
      this.emailInvalid = false;
      return;
    }
    this.emailInvalid = !this.EMAIL_REGEX.test(this.email);
  }

  validatePassword(): void {
    if (!this.password) {
      this.passwordInvalid = false;
      return;
    }
    this.passwordInvalid = this.password.length < 6;
  }

  // MÉTODO DE VALIDACIÓN COMPLETO
  validarCampos(): boolean {
    // Validar CI - Requerido
    if (!this.ci?.trim()) {
      Swal.fire('Error', 'La cédula es requerida', 'warning');
      return false;
    }

    // Validar formato CI
    if (!this.CEDULA_10.test(this.ci)) {
      Swal.fire('Error', 'La cédula debe tener exactamente 10 dígitos numéricos', 'warning');
      return false;
    }

    // Validar si la cédula ya existe
    if (this.cedulaExists) {
      Swal.fire('Error', 'La cédula ya está registrada en el sistema', 'warning');
      return false;
    }

    // Si está verificando la cédula, esperar
    if (this.cedulaChecking) {
      Swal.fire('Espere', 'Verificando cédula, por favor espere...', 'info');
      return false;
    }

    // Validar nombre - Requerido
    if (!this.name?.trim()) {
      Swal.fire('Error', 'El nombre es requerido', 'warning');
      return false;
    }

    // Validar formato nombre
    if (!this.NOMBRE_REGEX.test(this.name)) {
      Swal.fire('Error', 'El nombre solo debe contener letras y espacios (2-50 caracteres)', 'warning');
      return false;
    }

    // Validar si el nombre ya existe
    if (this.nombreExists) {
      Swal.fire('Error', 'El nombre ya está registrado en el sistema', 'warning');
      return false;
    }

    // Si está verificando el nombre, esperar
    if (this.nombreChecking) {
      Swal.fire('Espere', 'Verificando nombre, por favor espere...', 'info');
      return false;
    }

    // Validar email
    if (!this.email?.trim()) {
      Swal.fire('Error', 'El email es requerido', 'warning');
      return false;
    }

    if (!this.EMAIL_REGEX.test(this.email)) {
      Swal.fire('Error', 'El formato del email no es válido', 'warning');
      return false;
    }

    // Validar estado
    if (!this.type?.trim()) {
      Swal.fire('Error', 'El estado es requerido', 'warning');
      return false;
    }

    // Validar tipo de usuario
    if (!this.typeperfil?.trim()) {
      Swal.fire('Error', 'El tipo de usuario es requerido', 'warning');
      return false;
    }

    // Validar contraseña (solo para nuevo usuario)
    if (this.data.modo === 'agregar' && (!this.password?.trim() || this.password.length < 6)) {
      Swal.fire('Error', 'La contraseña es requerida y debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  // MÉTODO PRINCIPAL PARA GUARDAR O ACTUALIZAR
  ActualizarOregistrarUsuario() {
    // Primero validar todos los campos
    if (!this.validarCampos()) {
      return;
    }

    // Validación adicional antes de guardar
    if (this.cedulaExists) {
      Swal.fire('Error', 'No se puede guardar. La cédula ingresada ya existe en el sistema.', 'error');
      return;
    }

    if (this.nombreExists) {
      Swal.fire('Error', 'No se puede guardar. El nombre ingresado ya existe en el sistema.', 'error');
      return;
    }

    const url = 'http://localhost:3000/api/users/';
  
    let nuevoUsuario = {
      ci: this.ci,
      type: this.type,
      typeperfil: this.typeperfil,
      name: this.name,
      email: this.email,
      password: this.password
    };

    console.log(nuevoUsuario);

    if (this.data.modo === 'editar') {
      // Usar el CI original para la actualización
      const ciOriginal = this.cedulaOriginal;
      
      this.http.put(`${url}update/${ciOriginal}`, nuevoUsuario).subscribe({
        next: (res) => {
          this.cerrarDialog();
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El registro fue actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (err) => {
          // Manejar específicamente error de cédula duplicada del backend
          if (err.status === 409 || err.error?.message?.includes('cédula') || err.error?.message?.includes('duplicad')) {
            Swal.fire({
              icon: 'error',
              title: 'Cédula duplicada',
              text: 'La cédula ya existe en el sistema. Por favor, ingrese una cédula diferente.',
            });
            this.cedulaExists = true;
          } 
          // Manejar error de nombre duplicado del backend
          else if (err.error?.message?.includes('nombre') && err.error?.message?.includes('registrado')) {
            Swal.fire({
              icon: 'error',
              title: 'Nombre duplicado',
              text: 'El nombre ya existe en el sistema. Por favor, ingrese un nombre diferente.',
            });
            this.nombreExists = true;
          }
          else {
            const errorMessage = err.error?.error || err.error?.message || 'Ocurrió un problema al actualizar los datos.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
            });
          }
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
          // Manejar específicamente error de cédula duplicada del backend
          if (err.status === 409 || err.error?.message?.includes('cédula') || err.error?.message?.includes('duplicad')) {
            Swal.fire({
              icon: 'error',
              title: 'Cédula duplicada',
              text: 'La cédula ya existe en el sistema. Por favor, ingrese una cédula diferente.',
            });
            this.cedulaExists = true;
          } 
          // Manejar error de nombre duplicado del backend
          else if (err.error?.message?.includes('nombre') && err.error?.message?.includes('registrado')) {
            Swal.fire({
              icon: 'error',
              title: 'Nombre duplicado',
              text: 'El nombre ya existe en el sistema. Por favor, ingrese un nombre diferente.',
            });
            this.nombreExists = true;
          }
          else {
            const errorMessage = err.error?.error || err.error?.message || 'Ocurrió un problema al guardar los datos.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
            });
          }
        }
      });
    }
  }

  ngOnInit() {
    console.log('Data recibida en el diálogo:', this.data);

    if (this.data.modo === 'editar' && this.data.usuario) {
      const usuario = this.data.usuario;
      
      this.ci = usuario.ci;
      this.type = usuario.type;
      this.typeperfil = usuario.typeperfil;
      this.name = usuario.name;
      this.email = usuario.email;
      this.password = usuario.password || '';
      
      // Guardar valores originales para validación
      this.cedulaOriginal = usuario.ci;
      this.nombreOriginal = usuario.name;
      
      // Inicializar como no duplicados
      this.cedulaExists = false;
      this.cedulaValid = true;
      this.nombreExists = false;
      this.nombreValid = true;
    } else {
      // Valores por defecto para nuevo usuario
      this.type = 'activo';
      this.typeperfil = 'estudiante';
      this.cedulaOriginal = '';
      this.nombreOriginal = '';
    }
  }

  limpiarDatos() {
    this.ci = '';
    this.type = '';
    this.typeperfil = '';
    this.name = '';
    this.email = '';
    this.password = '';
    this.cedulaExists = false;
    this.cedulaValid = true;
    this.nombreExists = false;
    this.nombreValid = true;
    this.cedulaOriginal = '';
    this.nombreOriginal = '';
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }
}