import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SunflowerInfo } from './sunflower-info.module';

@Component({
    selector: 'app-third-part',
    templateUrl: './third-part.component.html',
    styleUrls: ['./third-part.component.scss'],
})
export class ThirdPartComponent implements OnInit {

    databaseObj: SQLiteObject;
    name_model: string = "";
    data: SunflowerInfo[] = [];
    readonly database_name: string = "sunflower.db";
    insertYear: number;
    insertWeight: number;
    insertYield: number;
    avarageWeight: number;

    constructor(private platform: Platform, private sqlite: SQLite) {
        this.platform.ready().then(() => {
            this.createDB();
        }).catch(error => {
            console.log(error);
        })
    }

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
        this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS SunflowerSeed (year int, yield int, weight int)', [])
            .then(() => {
                this.deleteData();
            })
            .catch(e => {
                alert("error2 " + JSON.stringify(e))
            });
    }

    deleteData() {
        this.databaseObj.executeSql('Delete from SunflowerSeed', [])
            .then(() => {
                this.seedData();
            })
            .catch(e => {
                alert("delete error" + JSON.stringify(e))
            });
    }

    seedData() {
        var values = [
            '1992,13047,2127000',
            '1993,12738,2075000',
            '1994,9096,1569000',
            '1995,14246,2860000',
            '1996,10480,2122800',
            '1997,11533,2308400',
            '1998,9322,2266000',
            '1999,9979,2794000',
            '2000,12167,3457400',
            '2001,9393,2250600',
            '2002,12026,3270500',
            '2003,11166,4254400',
            '2004,8900,3050100',
            '2005,12757,4706100',
            '2006,13611,5324300',
            '2007,12237,4174400',
            '2008,15250,6526000',
            '2009,15178,6364000',
            '2010,14961,6771500',
            '2011,18383,8670500',
            '2012,16505,8387100',
            '2013,21710,11050480',
            '2014,19442,10133750',
            '2015,21643,11181120',
            '2016,22388,13626890',
            '2017,20188,12235520',
            '2018,22971,14165170'
        ];
        values.forEach(value => {
            var record = value.split(',');
            this.databaseObj.executeSql('INSERT INTO SunflowerSeed (year, yield, weight) VALUES (?, ?, ?)', [record[0], record[1], record[2]])
                .catch(e => {
                    alert("insert error" + JSON.stringify(e))
                });
        });
    }

    insert() {
        if (this.insertYear > 0 && this.insertWeight > 0 && this.insertYield > 0) { 
            this.databaseObj.executeSql('INSERT INTO SunflowerSeed (year, yield, weight) VALUES (?, ?, ?)', [this.insertYear, this.insertYield, this.insertWeight])
                .then(() => {
                    this.show();
                })
                .catch(e => {
                    alert("insert error" + JSON.stringify(e))
                });
        } else {
            alert('Value should be positive integer');
        }
    }

    calcAvarage() {
        this.databaseObj.executeSql('SELECT AVG(weight) AS AV FROM SunflowerSeed', [])
            .then((res) => {
                this.avarageWeight = res.rows.item(0).AV;
            })
            .catch(e => {
                alert("insert error" + JSON.stringify(e))
            });
    }

    show() {
        this.data = [];
        this.databaseObj.executeSql('SELECT * FROM SunflowerSeed', [])
        .then((res) => {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    this.data.push(new SunflowerInfo(res.rows.item(i).year, res.rows.item(i).yield, res.rows.item(i).weight));
                }
            }
        })
        .catch(e => {
            alert("error " + JSON.stringify(e))
        });
    }

    showWhereMore() {
        this.data = [];
        this.databaseObj.executeSql('SELECT * FROM SunflowerSeed WHERE weight > ?', [6500000])
        .then((res) => {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    this.data.push(new SunflowerInfo(res.rows.item(i).year, res.rows.item(i).yield, res.rows.item(i).weight));
                }
            }
        })
        .catch(e => {
            alert("error " + JSON.stringify(e))
        });
    }

    deleteRow(item: SunflowerInfo) {
        this.databaseObj.executeSql('DELETE FROM SunflowerSeed WHERE year = ?', [item.year])
            .then((res) => {
                alert("Row Deleted!");
                this.show();
            })
            .catch(e => {
                alert("error " + JSON.stringify(e))
            });
    }

    update(item: SunflowerInfo) {
        this.databaseObj.executeSql('UPDATE SunflowerSeed SET yield = ?, weight = ? WHERE year = ?', [item.yieldValue, item.weight, item.year])
            .then((res) => {
                alert("Row Updated!");
                this.show();
            })
            .catch(e => {
                alert("error " + JSON.stringify(e))
            });
    }

    ngOnInit() { }

}
