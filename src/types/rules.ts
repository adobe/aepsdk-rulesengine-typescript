export interface Context {
  [key: string]: object | string;
}

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
export interface Matcher {
  matches(context, key, values): boolean;
}
