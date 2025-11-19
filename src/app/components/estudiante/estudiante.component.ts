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

export interface StudentData {
  id: string;
  name: string;
  email: string;
  carrera: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-estudiante',
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
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent implements AfterViewInit  {

  mostrarCard: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'email', 'carrera', 'acciones'];
  dataSource = new MatTableDataSource<StudentData>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.http.get<StudentData[]>('http://localhost:3000/api/estudiante/list')
      .subscribe(data => {
        console.log(data);
        this.dataSource.data = data;
      }, error => {
        console.error('Error al cargar estudiantes:', error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirDialogo(modo: 'agregar' | 'actualizar', estudiante?: any): void {
    console.log(estudiante);

    this.dialog.open(EstudianteComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      maxWidth: '90%',
      data: {
        modo: modo,
        estudiante: estudiante || null
      }
    }).afterClosed().subscribe(result => {
      this.cargarEstudiantes();
    });
  }

  eliminarEstudiante(estudiante: StudentData): void {
    if (confirm(`¿Está seguro que desea eliminar al estudiante ${estudiante.name}?`)) {
      this.http.delete(`http://localhost:3000/api/estudiante/delete/${estudiante.id}`)
        .subscribe({
          next: () => {
            console.log('Estudiante eliminado:', estudiante.id);
            this.cargarEstudiantes();
          },
          error: (error) => {
            console.error('Error al eliminar estudiante:', error);
            alert('Error al eliminar estudiante');
          }
        });
    }
  }
}