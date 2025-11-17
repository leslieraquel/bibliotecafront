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
// import { DialogPaqueteComponent } from './dialog-paquete/dialog-paquete.component';

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [MatFormFieldModule,
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
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.css'
})
export class LibroComponent implements AfterViewInit  {
  datos: any[] = [];
  datosFiltrados: any[] = [];
  ngAfterViewInit() {
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.cargarLibros();
    }

    constructor(private http: HttpClient,public dialog: MatDialog) {}
    

    cargarLibros() {
      this.http.get<any[]>('http://localhost:3000/api/libro/list')
        .subscribe(data => {
          console.log(data);
          this.datos  = data;
          this.datosFiltrados = [...this.datos]; 
          // this.dataSource.data = data;
        }, error => {
          console.error('Error al cargar itinerarios:', error);
        });
    }
    filtrar(event: any) {
    const texto = event.target.value.toLowerCase();

    this.datosFiltrados = this.datos.filter(item =>
      item.titulo.toLowerCase().includes(texto) ||
      item.autor.toLowerCase().includes(texto) ||
      item.categoria.toLowerCase().includes(texto)
    );
  }

}
