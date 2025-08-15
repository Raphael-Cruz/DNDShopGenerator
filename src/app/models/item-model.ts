export interface Item {
  name: string;
  source: string;
  page: number;
  rarity: string;
  quantity: number;
  cost: number;
  // Attunement info
  reqAttune?: string;
  reqAttuneTags?: Array<{
    class: string; // e.g. "monk", "artificer|tce"
  }>;

  // General categories
  wondrous?: boolean;
  weapon?: boolean;
  type?: string; // e.g. "M" for melee weapon, "INS" for instrument

  // Weapon/instrument specifics
  baseItem?: string;           // e.g. "sickle|PHB"
  weaponCategory?: string;     // e.g. "simple"
  property?: string[];         // e.g. ["L"]
  dmg1?: string;                // e.g. "1d4"
  dmgType?: string;             // e.g. "S"
  bonusWeapon?: string;        // e.g. "+1"

  // Bonuses to magic use
  bonusSpellAttack?: string;   // e.g. "+1"
  bonusSpellSaveDc?: string;   // e.g. "+1"

  // Casting focus or proficiency
  focus?: string[];            // e.g. ["Druid", "Ranger"]
  grantsProficiency?: boolean;

  // Physical details
  weight?: number;

  // Descriptive text
  entries: string[];
}

export interface MagicItem {
  name: string;
  type: string;
  cost: string;
  rarity: string;
  weight: string;
   source: string;
   quantity?: number; 

}


export interface MundaneNodes {
  name: string;
 type: string;
 checked: boolean;
  children?: MundaneNodes[];
}


export interface MagicNodes {
  name: string;
type: string;
checked: boolean;
  children?: MagicNodes[];
}

export interface FilterItem extends Item {
  children?: { type: string; checked?: boolean }[];
}
