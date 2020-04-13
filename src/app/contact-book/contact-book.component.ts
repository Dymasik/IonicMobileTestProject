import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ContactInfo } from './contact-info.module'
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
    selector: 'app-contact-book',
    templateUrl: './contact-book.component.html',
    styleUrls: ['./contact-book.component.scss'],
})
export class ContactBookComponent implements OnInit {
    contactList: ContactInfo[] = [];
    readonly lifecellCodes: string[] = ['63', '73', '93'];

    constructor(private plt: Platform, private contacts: Contacts) {
        this.plt.ready().then((readySource) => {
            this.show();
        });
    }

    show(lifecell: boolean = false) {
        this.contactList = [];
        this.contacts.find(["displayName", "phoneNumbers", "emails"])
            .then((contacts) => {
                for (var i = 0; i < contacts.length; i++) {
                    var firstSymbol = contacts[i].phoneNumbers[0].value[0];
                    var code = firstSymbol === '+' ? contacts[i].phoneNumbers[0].value.slice(5, 7) :
                        (firstSymbol === '(' ? contacts[i].phoneNumbers[0].value.slice(2, 4) :
                        contacts[i].phoneNumbers[0].value.slice(1, 3));
                    if (!lifecell || this.lifecellCodes.indexOf(code) !== -1) {
                        var contact = new ContactInfo();
                        contact.name = contacts[i].displayName;
                        contact.phone = contacts[i].phoneNumbers[0].value; 
                        contact.email = contacts[i].emails[0].value;
                        this.contactList.push(contact);
                    }
                }
            });
    }

    showLifecell() {
        this.show(true);
    }

    ngOnInit() { }

}
