import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';


declare const pdfjsLib: any;
declare const $: any;
@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule],
  templateUrl: './preview-dialog.component.html',
  styleUrl: './preview-dialog.component.css'
})
export class PreviewDialogComponent implements OnInit {
   constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // Configurar worker PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.mjs';
    await this.verPDF(this.data.id);
    // Aquí inicializas tu flipbook
  }

    async verPDF(id: string) {

    // 1. DESCARGAR PDF
    const pdfBlob = await this.http.get(
      `http://localhost:3000/api/libro/descargarPDF/${id}`,
      { responseType: 'blob' }
    ).toPromise();

    // 2. CREAR URL TEMPORAL
    const url = URL.createObjectURL(pdfBlob!);

    // 3. CARGAR CON PDF.js
    const loadingTask = (pdfjsLib as any).getDocument(url);
    const pdf = await loadingTask.promise;

    const flipbook = document.getElementById('flipbook');

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const pageDiv = document.createElement('div');
      pageDiv.appendChild(canvas);

      flipbook?.appendChild(pageDiv);
    }

    // 4. ACTIVAR TURN.JS
    ($('#flipbook') as any).turn({
      width: 800,
      height: 600,
      autoCenter: true
    });
  }
}
