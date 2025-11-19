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

export interface AutorData {
  id: string;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-autor',
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
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.css'
})
export class AutorComponent implements AfterViewInit  {

  mostrarCard: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'bio','acciones'];
  dataSource = new MatTableDataSource<AutorData>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.cargarAutores();
  }

  cargarAutores() {
    this.http.get<AutorData[]>('http://localhost:3000/api/autor/list')
      .subscribe(data => {
        console.log(data);
        this.dataSource.data = data;
      }, error => {
        console.error('Error al cargar autores:', error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirDialogo(modo: 'agregar' | 'actualizar', autor?: any): void {
    console.log(autor);

    this.dialog.open(AutorComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      maxWidth: '90%',
      data: {
        modo: modo,
        usuario: autor || null
      }
    }).afterClosed().subscribe(result => {
      this.cargarAutores();
    });
  }

  eliminarAutor(autor: AutorData): void {
    if (confirm(`¿Está seguro que desea eliminar al autor ${autor.name}?`)) {
      this.http.delete(`http://localhost:3000/api/autor/delete/${autor.id}`)
        .subscribe({
          next: () => {
            console.log('Autor eliminado:', autor.id);
            this.cargarAutores();
          },
          error: (error) => {
            console.error('Error al eliminar autor:', error);
            alert('Error al eliminar autor');
          }
        });
    }
  }
}

