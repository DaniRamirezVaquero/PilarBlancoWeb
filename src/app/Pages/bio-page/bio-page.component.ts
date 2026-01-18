import { Component } from '@angular/core';
import { DownloadBioBtnComponent } from '../../components/download-bio-btn/download-bio-btn.component';

@Component({
  selector: 'app-bio-page',
  standalone: true,
  imports: [DownloadBioBtnComponent],
  templateUrl: './bio-page.component.html',
  styleUrl: './bio-page.component.css'
})
export class BioPageComponent {

}
