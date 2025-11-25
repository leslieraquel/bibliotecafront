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
import { DialogConfGestionComponent } from './dialog-conf-gestion/dialog-conf-gestion.component';

export interface GestionData {
  id:string;
  nombreEstudiante: string;
}

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [  MatFormFieldModule,
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
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export class GestionComponent implements AfterViewInit  {

   mostrarCard: boolean = false;
    displayedColumns: string[] = ['id', 'nombreEstudiante'];
    dataSource = new MatTableDataSource<GestionData>();
  
    constructor(private http: HttpClient, public dialog: MatDialog) {}
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

      ngAfterViewInit() {
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.cargarHistorial();
    }

     cargarHistorial() {
        this.http.get<GestionData[]>('http://localhost:3000/api/autor/list')
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
      
        abrirDialogo(modo: 'agregar' | 'editar', autor?: any): void {
          console.log(autor);
      
          this.dialog.open(DialogConfGestionComponent, {
            panelClass: 'custom-dialog-container',
           width: '95%',   // 90% del ancho del viewport padre (ventana)
            height: '50%',  // 80% del alto del viewport padre
            data: {
              modo: modo,
              autor: autor || null
            }
          }).afterClosed().subscribe(result => {
            // this.cargarAutores();
          });
        }

}
