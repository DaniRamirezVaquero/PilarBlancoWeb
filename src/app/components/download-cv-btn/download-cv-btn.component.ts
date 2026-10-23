import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Descarga directa del CV en PDF (enlace con atributo download, sin JS). */
@Component({
    selector: 'app-download-cv-btn',
    imports: [IconComponent],
    templateUrl: './download-cv-btn.component.html',
    styleUrl: './download-cv-btn.component.css'
})
export class DownloadCvBtnComponent {}
