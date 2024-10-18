import { Color } from './color.enum';
import { Skier } from './skier.model';

export interface Piste {
  numPiste: number;
  namePiste: string;
  color: Color;
  length: number;
  slope: number;
  skiers: Skier[];
}
