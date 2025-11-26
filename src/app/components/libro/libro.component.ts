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
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';
// import { DialogPaqueteComponent } from './dialog-paquete/dialog-paquete.component';
import { jwtDecode } from 'jwt-decode';
import * as pdfjsLib from 'pdfjs-dist';
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
// (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
declare var $: any;
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
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.mjs';
    
  
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
      item.categoria.toLowerCase().includes(texto) ||
      item.id.toLowerCase().includes(texto)

    );
  }

  descargarPDF(id: string) {
  this.http.get(`http://localhost:3000/api/libro/descargarPDF/${id}`, {
    responseType: 'blob'
  }).subscribe({
    next: (blob: Blob) => {
      console.log("BLOB RECIBIDO:", blob);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "archivo.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.log("ERROR ANGULAR", err);
    }
  });
}

openPreview(id: string) {
  this.dialog.open(PreviewDialogComponent, {
    width: '90%',
    maxWidth: '1000px',
    height: '90%',
    data: { id }
  });
  const identificacion = localStorage.getItem('identificacion');
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  this.guardarRegistro(id,identificacion);
 
}

guardarRegistro(libro:any,estudiante:any){
    const estudianteData = {
        prestamoDate:"2025-11-25T00:00:00.000Z",
        devolucionDate:"2025-11-25T00:00:00.000Z",
        idEstudiante: estudiante,
        estado: "1",
        idLibro: libro
      };
  
      const baseUrl = 'http://localhost:3000/api/registro/';
  
        // Validar campos requeridos para agregar
          this.http.post(baseUrl + 'save', estudianteData).subscribe({
            next: (res) => {
              // this.cerrarDialog();
              // this.limpiarDatos();
            },
          });

}
// async verPDF(id: string) {
//    const pdfBlob = await this.http.get(
//     `http://localhost:3000/api/libro/descargarPDF/${id}`,
//     { responseType: 'blob' }
//   ).toPromise();

//   // 2. CREAR URL TEMPORAL DEL PDF
//   const url = URL.createObjectURL(pdfBlob!);

//   // 3. CARGAR CON PDF.js
//   const loadingTask = (pdfjsLib as any).getDocument(url);
//   const pdf = await loadingTask.promise;

//   const flipbook = document.getElementById('flipbook');

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const viewport = page.getViewport({ scale: 1 });

//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d')!;
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     await page.render({ canvasContext: context, viewport }).promise;

//     const pageDiv = document.createElement('div');
//     pageDiv.appendChild(canvas);

//     flipbook?.appendChild(pageDiv);
//   }

//   ($('#flipbook') as any).turn({
//     width: 800,
//     height: 600,
//     autoCenter: true
//   });
// }

  
}
