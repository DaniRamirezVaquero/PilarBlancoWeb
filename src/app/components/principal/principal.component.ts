import { Component, inject, OnInit } from '@angular/core';
import { PlayBtnComponent } from '../play-btn/play-btn.component';
import { SideNavService } from '../../services/side-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    PlayBtnComponent,
    CommonModule
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {

  sideNavIsOpen: boolean = false;
  subscription: any;

  constructor() { }

  sideNavService = inject(SideNavService);

  ngOnInit(): void {
    this.sideNavService.isOpen$.subscribe(isOpen => {
      this.sideNavIsOpen = isOpen;
    });
  }
}
