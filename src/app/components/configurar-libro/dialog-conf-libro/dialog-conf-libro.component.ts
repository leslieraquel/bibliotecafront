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
  selectedFile: File | null = null;
  isDragOver = false;


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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


  constructor (public dialog: MatDialog,private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any){}
   autores: any[] = [];
   idAutor:any;
   title: any;
   isbn: any;
   estado: any;
   sinopsis: any;
   autorSeleccionado: any;
   estadoSeleccionado:any;

   listarAutores() {
    return this.http.get<any[]>(`http://localhost:3000/api/autor/list`);
  }

    ActualizarOregistrarItinerario() {
  const nuevoLibro = {
    title: this.title,
    isbn: this.isbn,
    estado: this.estadoSeleccionado,
    idAutor:this.autorSeleccionado,
    sinopsis:   this.sinopsis
    // archivo: this.EstadoItinerario
  };

  const url = 'http://localhost:3000/api/autor/';
 
  if (this.data.modo === 'agregar') {
    if(nuevoLibro.title && nuevoLibro.isbn && nuevoLibro.estado && nuevoLibro.idAutor  ){
      this.http.post(url+'save', nuevoLibro).subscribe({
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

    }else{
      Swal.fire({
          icon: 'warning',
          title: 'Adevertencia',
          text: 'Llena los campos requeridos',
          confirmButtonText: 'Aceptar'
        });
    }

  } else if (this.data.modo === 'editar') {
  
     this.http.put(`${url}update/${nuevoLibro.title}`, nuevoLibro).subscribe({
     
    next: (res) => {
      this.cerrarDialog();
      Swal.fire({
        icon: 'success',
        title: 'Actualizado!',
        text: 'El registro fue actualizado exitosamente.',
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
  }
}


    ngOnInit() {
    console.log('Data recibida en el diálogo:', this.data);

    if (this.data.modo === 'editar' && this.data.libro) {
       const it = this.data.itinerario;
       this.title = it.nombreItinerario;
       this.isbn = it.idCategoria;
       this.estado = it.idNivel;
       this.sinopsis = it.idItinerario;
       this.idAutor = it.idAutor;

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
