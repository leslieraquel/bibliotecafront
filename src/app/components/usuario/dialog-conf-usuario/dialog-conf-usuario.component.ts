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

/*

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-conf-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './dialog-conf-usuario.component.html',
  styleUrl: './dialog-conf-usuario.component.css'
})
export class DialogConfUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  hidePassword = true;
  tiposUsuario = ['Administrador', 'Editor', 'Lector'];
  private baseUrl = 'http://localhost:3000/api/usuario/';

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.usuarioForm = this.crearFormulario();
  }

  ngOnInit() {
    console.log('Data recibida en el diálogo de usuario:', this.data);

    if (this.data.modo === 'actualizar' && this.data.usuario) {
      this.cargarDatosUsuario(this.data.usuario);
    }

    this.configurarValidacionesDinamicas();
    
    // Configurar validación asíncrona del CI
    this.configurarValidacionCiUnico();
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      ci: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/), // Solo números
        Validators.minLength(7),
        Validators.maxLength(10)
      ]],
      tipoSeleccionado: ['', Validators.required],
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.minLength(6)
      ]],
      confirmarPassword: ['']
    }, { 
      validators: this.validarCoincidenciaPassword.bind(this)
    });
  }

  // Validador asíncrono para CI único
  ciUnicoValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      // Si el campo está vacío o tiene errores de validación síncrona, no validar
      if (!control.value || control.errors?.['pattern'] || control.errors?.['minlength'] || control.errors?.['maxlength']) {
        return of(null);
      }

      const ci = control.value;
      
      // En modo actualizar, si el CI no ha cambiado, no validar
      if (this.data.modo === 'actualizar' && this.data.usuario && this.data.usuario.ci === ci) {
        return of(null);
      }

      // Usar debounce para evitar múltiples peticiones
      return of(control.value).pipe(
        debounceTime(500),
        switchMap(ciValue => 
          this.http.get<{ exists: boolean }>(`${this.baseUrl}check-ci/${ciValue}`).pipe(
            map(response => {
              return response.exists ? { ciDuplicado: true } : null;
            }),
            catchError(() => {
              // En caso de error, no marcamos como inválido para no bloquear al usuario
              return of(null);
            })
          )
        )
      );
    };
  }

  configurarValidacionCiUnico() {
    const ciControl = this.usuarioForm.get('ci');
    if (ciControl) {
      ciControl.setAsyncValidators(this.ciUnicoValidator());
      ciControl.updateValueAndValidity();
    }
  }

  configurarValidacionesDinamicas() {
    const passwordControl = this.usuarioForm.get('password');
    const confirmarPasswordControl = this.usuarioForm.get('confirmarPassword');

    if (this.data.modo === 'agregar') {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      confirmarPasswordControl?.setValidators([Validators.required]);
    } else {
      // En modo actualizar, el password es opcional
      passwordControl?.setValidators([
        Validators.minLength(6)
      ]);
      confirmarPasswordControl?.clearValidators();
    }

    passwordControl?.updateValueAndValidity();
    confirmarPasswordControl?.updateValueAndValidity();
  }

  cargarDatosUsuario(usuario: any) {
    this.usuarioForm.patchValue({
      ci: usuario.ci || '',
      tipoSeleccionado: usuario.type || '',
      nombre: usuario.name || '',
      email: usuario.email || ''
    });

    // Deshabilitar CI en modo actualizar (no se puede modificar)
    this.usuarioForm.get('ci')?.disable();
  }

  // Getters para acceder fácilmente a los controles
  get ci() { return this.usuarioForm.get('ci'); }
  get tipoSeleccionado() { return this.usuarioForm.get('tipoSeleccionado'); }
  get nombre() { return this.usuarioForm.get('nombre'); }
  get email() { return this.usuarioForm.get('email'); }
  get password() { return this.usuarioForm.get('password'); }
  get confirmarPassword() { return this.usuarioForm.get('confirmarPassword'); }

  // Validador personalizado para coincidencia de passwords
  validarCoincidenciaPassword(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmarPassword = control.get('confirmarPassword')?.value;

    if (password !== confirmarPassword) {
      control.get('confirmarPassword')?.setErrors({ noCoincide: true });
      return { noCoincide: true };
    }
    return null;
  }

  // Mensajes de error personalizados
  getErrorMessage(controlName: string): string {
    const control = this.usuarioForm.get(controlName);
    
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Formato de email inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (controlName === 'ci') return 'Solo se permiten números';
      if (controlName === 'nombre') return 'Solo se permiten letras y espacios';
    }
    if (errors['noCoincide']) return 'Las contraseñas no coinciden';
    if (errors['ciDuplicado']) return 'Esta cédula ya está registrada';

    return 'Error de validación';
  }

  // Verificar si el campo está validando asíncronamente
  isFieldValidating(controlName: string): boolean {
    const control = this.usuarioForm.get(controlName);
    return control ? control.status === 'PENDING' : false;
  }

  ActualizarOregistrarUsuario() {
    // Marcar todos los campos como tocados para mostrar errores
    this.marcarCamposComoTocados();

    if (this.usuarioForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos correctamente.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const formValue = this.usuarioForm.getRawValue();
    const usuarioData = {
      ci: formValue.ci,
      type: formValue.tipoSeleccionado,
      name: formValue.nombre,
      email: formValue.email,
      password: formValue.password || undefined
    };

    if (this.data.modo === 'agregar') {
      this.agregarUsuario(usuarioData);
    } else if (this.data.modo === 'actualizar') {
      this.actualizarUsuario(usuarioData);
    }
  }

  private agregarUsuario(usuarioData: any) {
    this.http.post(this.baseUrl + 'save', usuarioData).subscribe({
      next: (res) => {
        this.cerrarDialogConExito('¡Agregado!', 'El usuario fue agregado exitosamente.');
      },
      error: (err) => {
        this.mostrarError('Error al guardar el usuario', err);
      }
    });
  }

  private actualizarUsuario(usuarioData: any) {
    this.http.put(`${this.baseUrl}update/${usuarioData.ci}`, usuarioData).subscribe({
      next: (res) => {
        this.cerrarDialogConExito('¡Actualizado!', 'El usuario fue actualizado exitosamente.');
      },
      error: (err) => {
        this.mostrarError('Error al actualizar el usuario', err);
      }
    });
  }

  private marcarCamposComoTocados() {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.markAsTouched();
    });
  }

  private cerrarDialogConExito(titulo: string, mensaje: string) {
    this.dialog.closeAll();
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarError(titulo: string, error: any) {
    console.error(titulo, error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un problema al procesar la solicitud.',
      confirmButtonText: 'Aceptar'
    });
  }

  limpiarDatos() {
    this.usuarioForm.reset();
  }

  cerrarDialog() {
    this.dialog.closeAll();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
*/