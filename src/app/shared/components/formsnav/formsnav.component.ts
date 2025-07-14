import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formsnav',
  standalone: true,
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './formsnav.component.html',
  styleUrl: './formsnav.component.css',
})
export class FormsnavComponent implements OnInit {
  formId: string | null = null;
  @Input() isPreviewMode = false;
  @Output() previewToggle = new EventEmitter<void>();

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if a formId is provided in the route
    this.formId = this._route.snapshot.paramMap.get('formId');
  }

  onPreviewClick() {
    this.previewToggle.emit();
  }
}
