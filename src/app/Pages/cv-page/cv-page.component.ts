import { Component } from '@angular/core';
import { DownloadCvBtnComponent } from '../../components/download-cv-btn/download-cv-btn.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
    selector: 'app-cvpage',
    imports: [
        DownloadCvBtnComponent,
        IconComponent,
    ],
    templateUrl: './cv-page.component.html',
    styleUrl: './cv-page.component.css'
})
export class CVPageComponent {

}
