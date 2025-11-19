import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogConfLibroComponent } from './dialog-conf-libro/dialog-conf-libro.component';


export interface UserData {
  id: string;
  title: string;
  isbn: string;
  editorial: string;
  year: string;
  idAutor:string;
  sinopsis:string;
  archivo:string;
  estado:string;
  createdAt: string;
  updateAt: string;
}

@Component({
  selector: 'app-configurar-libro',
  standalone: true,
  imports: [ MatFormFieldModule,
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
             ReactiveFormsModule],
  templateUrl: './configurar-libro.component.html',
  styleUrl: './configurar-libro.component.css'
})
export class ConfigurarLibroComponent implements AfterViewInit  {

   mostrarCard: boolean = false;
    displayedColumns: string[] = ['id', 'title', 'isbn', 'editorial','nombreAutor','acciones'];
    dataSource = new MatTableDataSource<UserData>();

    constructor(private http: HttpClient,public dialog: MatDialog) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.cargarPaquetes();
    }

    cargarPaquetes() {
      this.http.get<UserData[]>('http://localhost:3000/api/libro/list')
        .subscribe(data => {
          console.log(data);
          this.dataSource.data = data;
        }, error => {
          console.error('Error al cargar libros:', error);
        });
    }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    abrirDialogo(modo: 'agregar' | 'editar', libro?: any): void {
      console.log(libro);

      this.dialog.open(DialogConfLibroComponent, {
        panelClass: 'custom-dialog-container',
          width: '95%',   // 90% del ancho del viewport padre (ventana)
          height: '85%',  // 80% del alto del viewport padre
          maxWidth: '90%',  // desactivar el maxWidth por defecto
           data: {
        modo: modo,                   // 'agregar' o 'editar'
        libro: libro || {} // si es editar, le pasas el objeto
      }
      }).afterClosed().subscribe(result => {
            this.cargarPaquetes();
      });

    }

}
