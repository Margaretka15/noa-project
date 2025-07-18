import React, { useState } from 'react';
import Autocomplete from './components/Autocomplete/Autocomplete';
import { AutocompleteItem } from './components/Autocomplete/types';
import './App.scss';

type User = {
    id: string;
    label: string;
    email: string;
}
const options: AutocompleteItem[] = [
    { id: 'css', label: 'CSS'},
    { id: 'html', label: 'HTML' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'actionscript', label: 'ActionScript' },
    { id: 'acl2', label: 'ACL2' }
];

const userOptions: User[] = [
    { id: '1', label: 'Alice Johnson', email: 'alice@example.com' },
    { id: '2', label: 'Bob Smith', email: 'bob@example.com' },
    { id: '3', label: 'Charlie Rose', email: 'charlie@example.com' }
];

export default function App() {
    const [selectedLanguages, setSelectedLanguages] = useState<AutocompleteItem[]>([]);
    const [selected, setSelected] = useState<AutocompleteItem[]>([]);

    return (
        <>

            <div className='container'>
                <h1 className='title'>Autocomplete component</h1>
                <Autocomplete
                    items={options}
                    selectedItems={selectedLanguages}
                    onChange={setSelectedLanguages}
                    placeholder="Select tags..."
                    allowCustom={true}
                />

            </div>

            <div className="container">
                <Autocomplete
                    items={userOptions}
                    selectedItems={selected}
                    onChange={setSelected}
                    placeholder="Select tags..."
                    allowCustom={true}
                />

            </div>
        </>

    );
}
