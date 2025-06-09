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
    this.currentElements.push(newElement);
    this.elementsSubject.next([...this.currentElements]);
  }

  clearElements() {
    this.currentElements = [];
    this.elementsSubject.next([]);
  }
  
  removeElement(selectedElement: Element){
    const index = this.currentElements.findIndex(
      (element) => element === selectedElement
    );
    if (index > -1) {
      this.currentElements.splice(index, 1); // Remove the element from the array
      this.elementsSubject.next([...this.currentElements]); // Emit the updated list
    }
  }

  updateElements(updatedElements: Element[]): void {
    this.currentElements = updatedElements;
    this.elementsSubject.next([...this.currentElements]);
  }
}
