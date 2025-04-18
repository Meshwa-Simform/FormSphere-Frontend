import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Element } from '../../modules/create-forms/interface/element';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  private elementsSubject = new BehaviorSubject<Element[]>([]);
  elements$ = this.elementsSubject.asObservable();

  private currentElements: Element[] = [];

  addElement(newElement: Element): void {
    const currentElements = this.elementsSubject.value;
    this.elementsSubject.next([...currentElements, newElement]);
  }

  clearElements() {
    this.currentElements = [];
    this.elementsSubject.next([]);
  }
  
}
