import { Injectable } from '@angular/core';
import * as Occurences from 'Occurences';

@Injectable({
  providedIn: 'root'
})
export class WordCounterService {
  textOccurrences: any;
  statsArray: any;


  constructor() { }

  coundWord(text: string): any {
    this.textOccurrences = new Occurences(text);
    this.statsArray = Object.keys(this.textOccurrences.stats).map(key => {
      return { word: key, number: this.textOccurrences.stats[key] };
    });
  }
}
