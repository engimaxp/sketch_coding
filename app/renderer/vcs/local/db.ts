import Dexie from 'dexie';
import {Contact} from './Contact';
import {PhoneNumber} from './PhoneNumber';
import {EmailAddress} from './EmailAddress';

export class AppDatabase extends Dexie {

    contacts: Dexie.Table<Contact, number>;
    emails: Dexie.Table<EmailAddress, number>;
    phones: Dexie.Table<PhoneNumber, number>;

    constructor() {

        super('ContactsDatabase');

        const dataBase = this;

        //
        // Define tables and indexes
        //
        dataBase.version(1).stores({
            contacts: '++id, firstName, lastName',
            emails: '++id, contactId, type, email',
            phones: '++id, contactId, type, phone',
        });

        // Let's physically map Contact class to contacts table.
        // This will make it possible to call loadEmailsAndPhones()
        // directly on retrieved database objects.
        dataBase.contacts.mapToClass(Contact);
    }
}

export const db = new AppDatabase();
