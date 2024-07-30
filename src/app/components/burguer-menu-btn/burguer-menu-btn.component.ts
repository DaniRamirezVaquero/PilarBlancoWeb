import { Component, inject, OnInit } from '@angular/core';
import { SideNavService } from '../../services/side-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-burguer-menu-btn',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './burguer-menu-btn.component.html',
  styleUrl: './burguer-menu-btn.component.css'
})
export class BurguerMenuBtnComponent implements OnInit {

  sideNavIsOpen: boolean = false;

  constructor() { }

  sideNavService = inject(SideNavService);

  ngOnInit(): void {
    this.sideNavService.isOpen$.subscribe(isOpen => {
      this.sideNavIsOpen = isOpen;
    });
  }
}
