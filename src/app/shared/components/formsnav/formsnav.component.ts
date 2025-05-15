import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formsnav',
  // prettier-ignore
   
  standalone: true,
  imports:[MaterialModule, RouterModule, CommonModule],
  templateUrl: './formsnav.component.html',
  styleUrl: './formsnav.component.css'
})
export class FormsnavComponent implements OnInit {
  formId: string | null = null;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if a formId is provided in the route
    this.formId = this._route.snapshot.paramMap.get('formId');
  }
}
