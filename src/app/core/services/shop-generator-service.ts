import { Injectable } from '@angular/core';
import { Shop } from '../../models/shop-model';

@Injectable({
  providedIn: 'root'
})
export class ShopGeneratorService {

  private alignments = [
    'Lawful Good',
    'Neutral Good',
    'Chaotic Good',
    'Lawful Neutral',
    'True Neutral',
    'Chaotic Neutral',
    'Lawful Evil',
    'Neutral Evil',
    'Chaotic Evil'
  ];

  private types = [
    'Magic Curio & Trade',
    'Blacksmith',
    'Alchemy Shop',
    'General Goods',
    'Arcane Relics Dealer',
    'Illicit Market',
    'Enchanted Armory'
  ];

  private settings = [
    'Urban, Any Campaign',
    'Seaside Port',
    'Mountain Hold',
    'Underground Bazaar',
    'Noble District',
    'Frontier Settlement',
    'Ancient Ruins'
  ];

  private descriptionTemplates = [
    `Tucked between shadow and lamplight, this establishment deals in wares both mundane and magnificent.`,
    `Rumored to exist only for those who know the right knock, this shop trades secrets as often as steel.`,
    `Perfumed with incense and old coin, the proprietor watches every movement with calculating precision.`,
    `Hidden behind an unmarked wooden door, treasures here are never listed twice.`,
    `Its shelves bend under relics whispered about in taverns across the realm.`
  ];

  generateShop(): Shop {
    return {
      name: this.generateName(),
      description: this.random(this.descriptionTemplates),
      alignment: this.random(this.alignments),
      type: this.random(this.types),
      setting: this.random(this.settings)
    };
  }

  private random(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateName(): string {
    const prefixes = ['Iron', 'Golden', 'Shadow', 'Silver', 'Obsidian', 'Arcane'];
    const suffixes = ['Forge', 'Emporium', 'Vault', 'Curios', 'Exchange', 'Bazaar'];

    return `${this.random(prefixes)} ${this.random(suffixes)}`;
  }
}