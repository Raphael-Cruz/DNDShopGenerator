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
