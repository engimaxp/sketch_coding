import React, { Component } from 'react';
import logo from './logo.svg';
import './home.css';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import {db} from '../../vcs/local/db';
import {UserInfo} from '../../vcs/local/UserInfo';

interface OptionSelect {
    value: string;
    label: string;
}

const options: OptionSelect[] = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

async function haveSomeFun() {
    //
    // Seed Database
    //
    console.log('Seeding database with some users...');
    await db.transaction('rw', db.users, db.repos, async () => {
        // Populate a contact
        const arnoldId = await db.users.add(new UserInfo('Arnold', 'Fitzgerald',
            'Arnold', 'Fitzgerald', 'Arnold'));

        // Populate some repos and phone numbers for the contact
        db.repos.add({ userId: arnoldId, repoName: 'home', repoCloneUrl: 'arnold@email.com',
            repoLocalUrl: 'arnold@email.com' });
        db.repos.add({ userId: arnoldId, repoName: 'work', repoCloneUrl: 'arnold@abc.com',
            repoLocalUrl: 'arnold@email.com' });

        // ... and another one...
        const adamId = await db.users.add(new UserInfo('Adam', 'Tensta',
            'Adam', 'Tensta', 'Adam'));
        // Populate some repos and phone numbers for the contact
        db.repos.add({ userId: adamId, repoName: 'home', repoCloneUrl: 'adam@tensta.se',
            repoLocalUrl: 'arnold@email.com' });
    });

    //
    // For fun - add a phone number to Adam
    //

    // Now, just to examplify how to use the save() method as an alternative
    // to db.phones.add(), we will add yet another phone number
    // to an existing contact and then re-save it:
    console.log('Playing a little: adding another phone entry for Adam Tensta...');
    const adam = (await db.users.orderBy('nickname').last()) || new UserInfo('default',
        'default', 'default', 'default', 'default');
    console.log(`Found contact: ${adam.nickname} ${adam.pinCode} (id: ${adam.id})`);

    // To add another phone number to adam, the straight forward way would be this:

    // But now let's do that same thing by manipulating navigation property instead:
    // Load repos and phones navigation properties
    await adam.loadNavigationProperties();

    // Now, just push another phone number to adam.phones navigation property:
    // And just save adam:
    console.log('Saving contact');
    await adam.save();

    // Now, print out all users
    console.log('Now dumping some users to console:');
    await printContacts();
}

async function printContacts() {

    // Now we're gonna list all users starting with letter 'A','B' or 'C'
    // and print them out.
    // For each contact, also resolve the navigation properties.

    // For atomicity and speed, use a single transaction for the
    // queries to make:
    const contacts = await db.transaction('r', [db.users, db.repos], async() => {

        // Query some users
        const someContacts = await db.users
            .where('nickname').startsWithAnyOfIgnoreCase('a', 'b', 'c')
            .sortBy('id');

        // Resolve array properties 'repos' and 'phones'
        // on each and every contact:
        await Promise.all (someContacts.map(contact => contact.loadNavigationProperties()));

        return someContacts;
    });

    // Print result
    console.log('Database contains the following users:');
    contacts.forEach(contact => {
        console.log(contact.id + '. ' + contact.nickname + ' ' + contact.pinCode);
        console.log('   Emails: ');
        contact.repos.forEach(repo => {
            console.log('     ' + repo.repoName + '(' + repo.repoCloneUrl + ')');
        });
    });
}

export default class Home extends Component {

    state = {
        selectedOption: null,
    };

    async componentDidMount() {

        //
        // Let's clear and re-seed the database:
        //
        console.log('Clearing database...');
        // await db.delete();
        // await db.open();
        await Promise.all([db.users.clear(), db.repos.clear()]);

        await haveSomeFun();
    }

    handleChange = (selectedOption: OptionSelect) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

  render() {
      const { selectedOption } = this.state;
      return (
          <div className="App">
              <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
              </header>
              <p className="App-intro">
                  To get started, edit <code>renderer/containers/App.tsx</code> and save to reload.
              </p>
              <Button variant="contained" color="primary">
                  Hello , World Again
              </Button>
              <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
              />
          </div>
    );
  }
}
