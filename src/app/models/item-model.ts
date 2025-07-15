export interface Item {
  name: string;
  type: string;
  cost: string;
  weight: string;
  source: string;
}

export interface MundaneNodes {
  name: string;
  children?: MundaneNodes[];
}

