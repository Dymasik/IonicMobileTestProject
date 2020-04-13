import { NumericValueAccessor } from '@ionic/angular';

export class FormulaValue {
    x: number;
    value: number;

    constructor(x, value) {
        this.x = x;
        this.value = value;
    }
}

export class FormulaHelper {
    m: number;
    y: number;
    x1: number;
    x2: number;
    dx: number;
    values: Array<FormulaValue>;
  
    constructor() {
        this.values = new Array<FormulaValue>();
    }
    
    get result(): number {

        return (this.m * this.m + 2.8 * this.m + 0.355) / (Math.cos(this.y * 2) + 3.6);
    }
  }
  