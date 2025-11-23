import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 // extraer dialog para boton nuevo
import { DialogConfUsuarioComponent } from './dialog-conf-usuario/dialog-conf-usuario.component';

export interface UserData {
  ci: string;
  type: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ 
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class ConfigurarUsuarioComponent  implements AfterViewInit  {

  mostrarCard: boolean = false;
  displayedColumns: string[] = ['ci', 'name', 'email', 'type', 'acciones'];
  dataSource = new MatTableDataSource<UserData>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    this.cargarUsuarios(); 
  }

  cargarUsuarios() {
    this.http.get<UserData[]>('http://localhost:3000/api/users/list')
      .subscribe(data => {
        console.log(data);
        this.dataSource.data = data;
      }, error => {
        console.error('Error al cargar usuarios:', error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirDialogo(modo: 'agregar' | 'editar', usuario?: any): void {
    console.log(usuario);

    this.dialog.open(DialogConfUsuarioComponent, {
      panelClass: 'custom-dialog-container',
      width: '95%',   // 90% del ancho del viewport padre (ventana)
      height: '85%',  // 80% del alto del viewport padre
      maxWidth: '90%',  // desactivar el maxWidth por defecto
      data: {
        modo: modo,
        usuario: usuario || null
      }
    }).afterClosed().subscribe(result => {
      this.cargarUsuarios();
    });
  }
/*
  eliminarUsuario(usuario: UserData): void {
    if (confirm(`¿Está seguro que desea eliminar al usuario ${usuario.name}?`)) {
      this.http.delete(`http://localhost:3000/api/usuario/delete/${usuario.ci}`)
        .subscribe({
          next: () => {
            console.log('Usuario eliminado:', usuario.ci);
            this.cargarUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario');
          }
        });
    }
  }*/
}