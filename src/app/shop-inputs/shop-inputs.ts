import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InputDatas, RandomInputData, FormDataType, AuthModalService } from '../input-datas';
import { Item, MagicItem } from '../models/item-model';
import { ShopPreset } from '../ShopPreset/shop-preset/shop-presets';
import { AuthService } from '../core/services/auth';



@Component({
  selector: 'app-shop-inputs',
  templateUrl: './shop-inputs.html',
  styleUrls: ['./shop-inputs.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopInputs implements OnInit {
  shopName = '';
  mundaneItems = '';
  commonItems = '';
  uncommonItems = '';
  rareItems = '';
  veryRareItems = '';
  legendaryItems = '';
  artifactItems = '';

  selectedOptionMundane = 'one';
  selectedOptionCommon = 'one';
  selectedOptionUncommon = 'one';
  selectedOptionRare = 'one';
  selectedOptionVeryRare = 'one';
  selectedOptionLegendary = 'one';
  selectedOptionArtifact = 'one';

  constructor(
    private dataShare: InputDatas,
    private randomInputData: RandomInputData,
    private router: Router,
    private authService: AuthService,
    private authModal: AuthModalService
  ) { }

  ngOnInit(): void {
    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
    }
  }

  get isFormValid(): boolean {
    return this.shopName.trim() !== '' && (
      this.mundaneItems.trim() !== '' ||
      this.commonItems.trim() !== '' ||
      this.uncommonItems.trim() !== '' ||
      this.rareItems.trim() !== '' ||
      this.veryRareItems.trim() !== '' ||
      this.legendaryItems.trim() !== '' ||
      this.artifactItems.trim() !== ''
    );
  }

  onSelectChange(field: string, option: string) {
    let value = '';
    if (option === 'one') value = '';
    else switch (option) {
      case 'two': value = '5'; break;
      case 'three': value = '10'; break;
      case 'four': value = this.roll1d3().toString(); break;
      case 'five': value = this.roll2d4().toString(); break;
      case 'six': value = this.roll1d12().toString(); break;
      case 'seven': value = this.roll1d43().toString(); break;
      case 'eight': value = this.roll1d2019().toString(); break;
    }
    (this as any)[field] = value;
    (this as any)['selectedOption' + field[0].toUpperCase() + field.slice(1)] = option;
  }


  isInputEnabled(option: string): boolean {
    return option === 'one' || !option;
  }

  roll1d3() { return Math.floor(Math.random() * 3) + 1; }
  roll2d4() { return Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1; }
  roll1d12() { return Math.floor(Math.random() * 12) + 1; }
  roll1d43() { return Math.floor(Math.random() * 4) + 1 + 3; }
  roll1d2019() { return Math.floor(Math.random() * 20) + 1 === 20 ? 1 : 0; }

  // --- Normalize MagicItem to Item ---
  private normalizeToItem(raw: Item | MagicItem): Item {
    return {
      name: raw.name,
      type: raw.type ?? raw.rarity,
      cost: typeof raw.cost === 'string' ? parseFloat(raw.cost) || 0 : raw.cost || 0,
      rarity: raw.rarity,
      weight: typeof raw.weight === 'string' ? parseFloat(raw.weight as string) || 0 : raw.weight || 0,
      source: raw.source,
      quantity: raw.quantity ?? 1
    };
  }

  private generateRandomItems(): Item[] {
    const items: Item[] = [];
    const addItems = (countStr: string, rarity: string) => {
      const count = parseInt(countStr, 10);
      if (!count) return;

      const pool = this.dataShare.getAllItems().filter(it => it.type === rarity || it.rarity === rarity);
      for (let i = 0; i < count; i++) {
        if (!pool.length) return;
        const rawItem = pool[Math.floor(Math.random() * pool.length)];
        const item = this.normalizeToItem(rawItem);
        items.push(item);
        this.randomInputData.setRandomData(item);
      }
    };

    addItems(this.mundaneItems, 'Mun.');
    addItems(this.commonItems, 'Com.');
    addItems(this.uncommonItems, 'Unc.');
    addItems(this.rareItems, 'Rare');
    addItems(this.veryRareItems, 'V.Rare');
    addItems(this.legendaryItems, 'Leg.');
    addItems(this.artifactItems, 'Art.');

    return items;
  }


  // ── Rate limiting (frontend) ──
  private getRateKey(type: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `grimoire_limit_${type}_${today}`;
  }

  private getUsageCount(type: string): number {
    const key = this.getRateKey(type);
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

  private incrementUsage(type: string): void {
    const key = this.getRateKey(type);
    const current = this.getUsageCount(type);
    localStorage.setItem(key, (current + 1).toString());
  }

  private checkAndEnforceLimit(): boolean {
    const limit = this.authService.isLoggedIn() ? 10 : 2;
    const used = this.getUsageCount('shop');

    if (used >= limit) {
      if (!this.authService.isLoggedIn()) {
        alert(`Daily limit reached (\/\ shops).

Create a free account to generate up to 10 shops per day!`);
        this.authModal.open('register');
      } else {
        alert(`Daily limit reached (\/\ shops).

Your limit resets at midnight (UTC).`);
      }
      return false;
    }
    return true;
  }

  async onSubmit() {
    if (!this.isFormValid) return;
    if (!this.checkAndEnforceLimit()) return;

    // Garante que os itens do banco estão carregados antes de gerar
    if (this.dataShare.getAllItems().length === 0) {
      this.dataShare.refreshItems();
      await firstValueFrom(
        this.dataShare.items$.pipe(
          filter((items: any[]) => items.length > 0),
          take(1)
        )
      ).catch(() => { });
    }

    const formData: FormDataType = {
      shopName: this.shopName,
      mundaneItems: this.mundaneItems,
      commonItems: this.commonItems,
      uncommonItems: this.uncommonItems,
      rareItems: this.rareItems,
      veryRareItems: this.veryRareItems,
      legendaryItems: this.legendaryItems,
      artifactItems: this.artifactItems
    };

    this.dataShare.setFormData(formData);
    const randomItems = this.generateRandomItems();
    const payload = { name: this.shopName || 'Unnamed Shop', items: randomItems, formData };
    this.incrementUsage('shop');

    if (this.authService.isLoggedIn()) {
      // Logado: salva no banco e navega
      this.dataShare.saveShopToDB(payload).subscribe({
        next: (savedShop) => {
          console.log('Shop saved successfully', savedShop);
          this.resetForm();
          this.router.navigate(['/myshops']);
        },
        error: (err) => console.error('Failed to save shop', err)
      });
    } else {
      // Anônimo: navega sem limpar — generated-form lê RandomInputData
      // resetForm() NÃO é chamado aqui para preservar os itens em memória
      this.resetFormFields(); // limpa só os campos do form, não o RandomInputData
      this.router.navigate(['/myshops']);
    }
  }

  private resetForm() {
    this.shopName = '';
    this.mundaneItems = '';
    this.commonItems = '';
    this.uncommonItems = '';
    this.rareItems = '';
    this.veryRareItems = '';
    this.legendaryItems = '';
    this.artifactItems = '';

    this.selectedOptionMundane = 'one';
    this.selectedOptionCommon = 'one';
    this.selectedOptionUncommon = 'one';
    this.selectedOptionRare = 'one';
    this.selectedOptionVeryRare = 'one';
    this.selectedOptionLegendary = 'one';
    this.selectedOptionArtifact = 'one';

    this.randomInputData.clear();
  }

  // Limpa só os campos do formulário — NÃO zera o RandomInputData
  // Usado por anônimos para preservar os itens em memória até o generated-form ler
  private resetFormFields() {
    this.shopName = '';
    this.mundaneItems = '';
    this.commonItems = '';
    this.uncommonItems = '';
    this.rareItems = '';
    this.veryRareItems = '';
    this.legendaryItems = '';
    this.artifactItems = '';

    this.selectedOptionMundane = 'one';
    this.selectedOptionCommon = 'one';
    this.selectedOptionUncommon = 'one';
    this.selectedOptionRare = 'one';
    this.selectedOptionVeryRare = 'one';
    this.selectedOptionLegendary = 'one';
    this.selectedOptionArtifact = 'one';
    // randomInputData.clear() é intencionalmente omitido aqui
  }

  applyPreset(preset: ShopPreset) {
    this.shopName = preset.formData.shopName;
    this.mundaneItems = preset.formData.mundaneItems as string;
    this.commonItems = preset.formData.commonItems as string;
    this.uncommonItems = preset.formData.uncommonItems as string;
    this.rareItems = preset.formData.rareItems as string;
    this.veryRareItems = preset.formData.veryRareItems as string;
    this.legendaryItems = preset.formData.legendaryItems as string;
    this.artifactItems = preset.formData.artifactItems as string;

    // Força todos os selects de volta para "Custom" (editável)
    this.selectedOptionMundane = 'one';
    this.selectedOptionCommon = 'one';
    this.selectedOptionUncommon = 'one';
    this.selectedOptionRare = 'one';
    this.selectedOptionVeryRare = 'one';
    this.selectedOptionLegendary = 'one';
    this.selectedOptionArtifact = 'one';
  }

}