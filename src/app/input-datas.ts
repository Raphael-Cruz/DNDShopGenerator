import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputDatas {
   private formData = new BehaviorSubject<{ mundaneItems: string; commonItems: string, uncommonItems: string, rareItems: string, veryRareItems: string, legendaryItems: string  } | null>(null);
  formData$ = this.formData.asObservable();



   setFormData(data: { mundaneItems: string; commonItems: string, uncommonItems: string, rareItems: string, veryRareItems: string, legendaryItems: string }) {
    this.formData.next(data);
}
}
@Injectable({
  providedIn: 'root'
})
export class RandomInputData {
  private randomData = new BehaviorSubject<{ randomItems: string } | null>({ randomItems: '' });
  randomData$ = this.randomData.asObservable();

  setRandomData(data: { randomItems: string }) {
    const current = this.randomData.value;
    const existing = current?.randomItems ?? '';
    const newValue = existing
      ? `${existing}, ${data.randomItems}`  // acumula novos itens
      : data.randomItems;

    this.randomData.next({ randomItems: newValue });
  }
}