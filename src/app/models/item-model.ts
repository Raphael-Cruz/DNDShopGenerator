export interface Item {
  name: string;
  type: string;
  cost: string;
  rarity: string;
  weight: string;
  source: string;
}

export interface MagicItem {
  name: string;
  type: string;
  cost: string;
  rarity: string;
  weight: string;
   source: string;

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
