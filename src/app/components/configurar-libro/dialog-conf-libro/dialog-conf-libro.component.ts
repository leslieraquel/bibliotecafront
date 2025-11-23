import { Component,OnInit  } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-conf-libro',
  standalone: true,
  imports: [MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './dialog-conf-libro.component.html',
  styleUrl: './dialog-conf-libro.component.css'
})
export class DialogConfLibroComponent implements OnInit {
  public selectedFile: File | null = null;
  public archivoUrl: string | null = null; 
  isDragOver = false;
  idlibro:string="";


 onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  this.archivoUrl = null; // Si elige uno nuevo, se elimina el antiguo
}

  
onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = true;
}
onDragLeave(event: DragEvent) {
  this.isDragOver = false;
}
  onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;

  if (event.dataTransfer?.files.length) {
    this.selectedFile = event.dataTransfer.files[0];
    this.archivoUrl = null; // Se elimina archivo previo si arrastra uno nuevo
  }
}

    upload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append("archivo", this.selectedFile);

    this.http.post("http://localhost:3000/libros", formData)
      .subscribe({
        next: res => console.log("Subido", res),
        error: err => console.error(err)
      });
  }
removeFile(event: Event) {
  event.stopPropagation(); // para que no abra el file input al hacer clic en X
  this.selectedFile = null;
  this.archivoUrl = null;
}


  constructor (public dialog: MatDialog,private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any){}
   autores: any[] = [];
   idAutor:any;
   title: any;
   isbn: any;
   editorial: any;
   year:any;
   estado: any;
   sinopsis: any;
   autorSeleccionado: any;
   estadoSeleccionado:any;

   listarAutores() {
    return this.http.get<any[]>(`http://localhost:3000/api/autor/list`);
  }

  ActualizarOregistrarItinerario() {
    
  const formData = new FormData();

  formData.append("title", this.title);
  formData.append("isbn", this.isbn);
  formData.append("editorial", this.editorial ?? ""); 
  formData.append("year", this.year);
  formData.append("idAutor", this.autorSeleccionado);
  formData.append("sinopsis", this.sinopsis);
  formData.append("estado", this.estadoSeleccionado);
  formData.append("id", this.idlibro);

  if (this.selectedFile) {
    formData.append("archivo", this.selectedFile);
  }
  formData.append("createdAt", new Date().toISOString());
  formData.append("updateAt", new Date().toISOString());

  const url = 'http://localhost:3000/api/libro/';
 
  if (this.data.modo === 'agregar') {
    // console.log(nuevoLibro);
    // if(formData.title && formData.isbn && formData.estado && formData.idAutor  ){
      this.http.post(url+'libros', formData).subscribe({
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
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar los datos.',
        });
      }
    });

    // }else{
    //   Swal.fire({
    //       icon: 'warning',
    //       title: 'Adevertencia',
    //       text: 'Llena los campos requeridos',
    //       confirmButtonText: 'Aceptar'
    //     });
    // }

  } 
  else if (this.data.modo === 'editar') {
    if (!this.selectedFile && this.archivoUrl) {
    formData.append("archivoActual", this.archivoUrl);  // ✔ SE ENVÍA
  }
  
    this.http.put(`${url}update/${this.idlibro}`, formData).subscribe({
      next: (res) => {
        this.cerrarDialog();
      Swal.fire({
        icon: 'success',
        title: 'Actualizado!',
        text: 'El registro fue actualizado exitosamente.',
        confirmButtonText: 'Aceptar'
      });
      console.log(formData);
    },
    error: (err) => {
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un problema al guardar los datos.',
      });
    }
  });
  }
}


    ngOnInit() {
    console.log('Data recibida en el diálogo:', this.data);

    if (this.data.modo === 'editar' && this.data.libro) {
      const it = this.data.libro;
      console.log(it.id);
       this.title = it.title;
       this.isbn = it.isbn;
       this.estadoSeleccionado = it.estado;
       this.sinopsis = it.sinopsis;
       this.autorSeleccionado = it.idAutor;
       this.selectedFile = it.archivo;
       this.editorial = it.editorial;
       this.year = it.year;
       this.archivoUrl = it.archivo;
       this.selectedFile = null;
       this.idlibro = it.id;
       

    }
    
    this.listarAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
        console.log("objeto"+this.autores);
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });

  
  }
     limpiarDatos(){
    this.title = "";
    this.autorSeleccionado="";
    this.estadoSeleccionado="";
    this.isbn= "";
    this.sinopsis= "";

  }
   cerrarDialog(){
    this.dialog.closeAll();
  }

}
