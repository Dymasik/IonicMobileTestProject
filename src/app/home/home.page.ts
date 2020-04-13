import { Component } from '@angular/core';
import { FormulaHelper } from './formula-helper.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  helper: FormulaHelper;

  constructor() {
    this.helper = new FormulaHelper();
  }

}
