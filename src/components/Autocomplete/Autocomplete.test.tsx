import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Autocomplete from './Autocomplete';
import { AutocompleteItem } from './types';

const mockItems: AutocompleteItem[] = [
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Cherry' },
];

describe('Autocomplete', () => {
    it('renders input with placeholder', () => {
        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={jest.fn()}
                placeholder="Search fruits"
            />
        );

        expect(screen.getByPlaceholderText('Search fruits')).toBeInTheDocument();
    });

    it('shows filtered suggestions on input', async () => {
        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={jest.fn()}
            />
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'ap');

        const option = await screen.findByText('Apple');
        expect(option).toBeInTheDocument();
    });

    it('calls onChange when item is selected', async () => {
        const handleChange = jest.fn();

        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'ban');

        const bananaOption = await screen.findByText('Banana');
        await userEvent.click(bananaOption);

        expect(handleChange).toHaveBeenCalledWith([
            { id: '2', label: 'Banana' },
        ]);
    });

    it('adds custom item if allowCustom is true', async () => {
        const handleChange = jest.fn();

        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={handleChange}
                allowCustom={true}
            />
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'Durian');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith([
            { id: 'Durian', label: 'Durian' },
        ]);
    });

    it('removes the last tag on Backspace when a tag is focused', async () => {
        const handleChange = jest.fn();
        const selected = [{ id: '1', label: 'Apple' }];

        render(
            <Autocomplete
                items={mockItems}
                selectedItems={selected}
                onChange={handleChange}
            />
        );

        const tag = screen.getByText('Apple');
        tag.focus();

        fireEvent.keyDown(tag, { key: 'Backspace' });

        expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('closes dropdown when clicking outside', async () => {
        render(
            <div>
                <Autocomplete
                    items={mockItems}
                    selectedItems={[]}
                    onChange={jest.fn()}
                />
                <button data-testid="outside">Outside</button>
            </div>
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'ap');

        expect(await screen.findByText('Apple')).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId('outside'));

        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('does not allow custom item if allowCustom is false', async () => {
        const handleChange = jest.fn();

        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={handleChange}
                allowCustom={false}
            />
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'Durian');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('navigates with arrow keys and selects with enter', async () => {
        const handleChange = jest.fn();

        render(
            <Autocomplete
                items={mockItems}
                selectedItems={[]}
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'ch');

        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith([{ id: '3', label: 'Cherry' }]);
    });

});
