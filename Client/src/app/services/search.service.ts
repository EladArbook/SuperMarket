import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() { }
  private name: BehaviorSubject<string> = new BehaviorSubject("");
  private searchLetters: BehaviorSubject<string> = new BehaviorSubject("");
  private showSearch: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getShowSearch(): Observable<boolean> {
    return this.showSearch.asObservable();
  }

  setShowSearch(showHide: boolean): void {    
    this.showSearch.next(showHide);
  }

  getSearchLetters(): Observable<string> {
    return this.searchLetters.asObservable();
  }

  setSearchLetters(letters: string): void {
    this.searchLetters.next(letters);
  }

  getUserName() {
    return this.name.asObservable();
  }

  setUserName(name: string) {
    this.name.next(name);
  }

}
