import { Component, OnInit, ViewChild } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { FormulaHelper, FormulaValue } from '../home/formula-helper.module';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-second-part',
    templateUrl: './second-part.component.html',
    styleUrls: ['./second-part.component.scss'],
})
export class SecondPartComponent implements OnInit {
    lineChart: any;
    @ViewChild('lineCanvas', {static: false}) lineCanvas;

    databaseObj: SQLiteObject;
    name_model: string = "";
    row_data: any = [];
    readonly database_name: string = "data.db";
    helper: FormulaHelper;

    constructor(private platform: Platform, private sqlite: SQLite) {
        this.helper = new FormulaHelper();
        this.platform.ready().then(() => {
            this.createDB();
        }).catch(error => {
            console.log(error);
        })
    }

    calculate() {
        this.databaseObj.executeSql('DELETE FROM Function', [])
        .then(() => {
            var x1 = this.helper.x1;
            while (x1 <= this.helper.x2) {
                this.helper.values = new Array<FormulaValue>();
                var value = 128.355/(Math.cos(2 * x1)+3.6);
                this.databaseObj.executeSql('INSERT INTO Function (x, value) VALUES (?, ?)', [x1, value.toFixed(2)])
                .catch(e => {
                    alert("insert error" + JSON.stringify(e))
                });
                x1 += this.helper.dx;
            }
        })
        .catch(e => {
            alert("delete error" + JSON.stringify(e))
        });
    }

    showChart() {
        var labels = this.helper.values.map(value => value.x);
        var values = this.helper.values.map(value => value.value);
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'My First dataset',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: values,
                        spanGaps: false,
                    }
                ]
            }
        });
    }

    show() {
        this.databaseObj.executeSql('SELECT * FROM Function', [])
        .then((res) => {
            this.helper.values = [];
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    this.helper.values.push(new FormulaValue(res.rows.item(i).x, res.rows.item(i).value));
                    this.showChart();
                }
            }
        })
        .catch(e => {
            alert("error " + JSON.stringify(e))
        });
    }

    ngOnInit() { }

    createDB() {
        this.sqlite.create({
            name: this.database_name,
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                this.databaseObj = db;
                this.createTable();
            })
            .catch(e => {
                alert("error " + JSON.stringify(e))
            });
    }

    createTable() {
        this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS Function (x decimal(10, 5), value decimal(10, 5))', [])
            .then(() => {
                alert('Table Created!');
            })
            .catch(e => {
                alert("error2 " + JSON.stringify(e))
            });
    }
}
