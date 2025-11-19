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
export class UsuarioComponent implements AfterViewInit  {

  mostrarCard: boolean = false;
  displayedColumns: string[] = ['ci', 'name', 'email', 'type', 'acciones'];
  dataSource = new MatTableDataSource<UserData>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<UserData[]>('http://localhost:3000/api/usuario/list')
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

  abrirDialogo(modo: 'agregar' | 'actualizar', usuario?: any): void {
    console.log(usuario);

    this.dialog.open(UsuarioComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      maxWidth: '90%',
      data: {
        modo: modo,
        usuario: usuario || null
      }
    }).afterClosed().subscribe(result => {
      this.cargarUsuarios();
    });
  }

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
  }
}