export interface Consequence {
  type: string;
  detail: any;
  id: string;
}
export interface Rule {
  condition: any;
  consequences: Array<Consequence>;
}
export interface RuleSet {
  version: number;
  rules: Array<Rule>;
}
