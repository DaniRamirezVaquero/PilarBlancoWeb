import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Descarga del CV en PDF: un enlace nativo `download`, con formato y peso visibles. */
@Component({
    selector: 'app-download-cv-btn',
    imports: [IconComponent],
    templateUrl: './download-cv-btn.component.html',
    styleUrl: './download-cv-btn.component.css'
})
export class DownloadCvBtnComponent {}
