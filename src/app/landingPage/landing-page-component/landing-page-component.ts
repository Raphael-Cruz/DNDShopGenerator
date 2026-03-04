import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing-page-component.html',
  styleUrls: ['./landing-page-component.css'],
})
export class LandingPageComponent {
  @ViewChild('featuresSection') featuresSection!: ElementRef;

  embers = Array.from({ length: 30 }, (_, i) => ({
    style: `
      left: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${5 + Math.random() * 8}s;
      opacity: ${0.3 + Math.random() * 0.7};
    `,
  }));

  stats = [
    { value: '1000+', label: 'Shops Generated' },
    { value: '1500+', label: 'Items' },

    { value: '∞', label: 'Adventures Ahead' },
  ];

  features = [
    {
      icon: '🏪',
      name: 'Shop Archetypes',
      desc: 'Blacksmiths, apothecaries, black markets, hedge-witch hovels, dwarven vaults, and more — each with distinct inventory pools and flavor.',
      tag: 'World Building',
    },
    {
      icon: '📜',
      name: 'Lore-Rich Descriptions',
      desc: 'Every shop comes with a unique proprietor, origin story, and atmosphere that slots seamlessly into any setting.',
      tag: 'Narrative',
    },
    {
      icon: '⚔️',
      name: 'Balanced Inventory',
      desc: 'Mundane, common, uncommon, rare, very rare, legendary and artifact items weighted by shop wealth and settlement size.',
      tag: 'Game Balance',
    },
    {
      icon: '🎲',
      name: 'Haggling & Events',
      desc: 'Integrated dice tables for surprise stock numbers to keep every visit fresh.',
      tag: 'Interactivity',
    },
    {
      icon: '🗺️',
      name: 'Settlement Aware',
      desc: 'Hamlets, towns, and metropolises. Generate wildly different shops. Context matters.',
      tag: 'Depth',
    },
    {
      icon: '📋',
      name: 'Export & Share',
      desc: 'Print-ready cards, JSON export straight into your VTT of choice.',
      tag: 'Utility',
    },
  ];

  sampleItems = [
    { name: 'Whispering Dagger', price: '450 gp', type: 'Weapon', rarity: 'rare' },
    { name: 'Potion of Clarity', price: '60 gp', type: 'Consumable', rarity: 'uncommon' },
    { name: 'Merchant\'s Ledger', price: '12 gp', type: 'Tool', rarity: 'common' },
    { name: 'Ring of False Tongue', price: '800 gp', type: 'Wondrous', rarity: 'rare' },
    { name: 'Ironwood Shield', price: '180 gp', type: 'Armor', rarity: 'uncommon' },
    { name: 'Candle of Seeking', price: '25 gp', type: 'Consumable', rarity: 'common' },
  ];

  steps = [
    {
      icon: '🏰',
      name: 'Set the Scene',
      desc: 'Choose your settlement type, wealth level, and shop category.',
    },
    {
      icon: '✨',
      name: 'Cast the Spell',
      desc: 'The Grimoire weaves lore, inventory, and personality into a living shop.',
    },
    {
      icon: '📖',
      name: 'Run the Scene',
      desc: 'Drop it straight into your session. Your players will never know it took 3 seconds.',
    },
  ];

  ctaRunes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

  openGenerator() {
    // Navigate to generator route
    console.log('open generator');
  }

  scrollToFeatures() {
    this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}