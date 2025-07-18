import React, {useState, useRef, useEffect} from 'react';
import styles from './Autocomplete.module.scss';
import {AutocompleteItem, AutocompleteProps} from './types';
import Tag from "./Tag";

const Autocomplete = <T extends AutocompleteItem>({
                                                      items,
                                                      selectedItems,
                                                      onChange,
                                                      placeholder = 'Type to search...',
                                                      allowCustom = true
                                                  }: AutocompleteProps<T>) => {

    const [inputValue, setInputValue] = useState('');
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);
    const [filteredItems, setFilteredItems] = useState<T[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            const newFiltered = items.filter(
                (item) =>
                    item.label.toLowerCase().includes(inputValue.toLowerCase()) &&
                    !selectedItems.find((s) => s.id === item.id)
            );
            setFilteredItems(newFiltered);
            setHighlightIndex(-1);
        }
    }, [inputValue, items, selectedItems, isFocused]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setHighlightIndex((prev) =>
                Math.min(prev + 1, filteredItems.length - 1)
            );
        } else if (e.key === 'ArrowUp') {
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightIndex >= 0 && filteredItems[highlightIndex]) {
                selectItem(filteredItems[highlightIndex]);
            } else if (inputValue.trim() && allowCustom) {
                const newItem = {
                    id: inputValue,
                    label: inputValue
                } as T;
                selectItem(newItem);
            }
        }
    };

    const selectItem = (item: T) => {
        const newSelected = [...selectedItems, item];
        onChange(newSelected);
        setInputValue('');

        const updatedFiltered = items.filter(
            (i) =>
                i.label.toLowerCase().includes('') &&
                !newSelected.find((s) => s.id === i.id)
        );
        setFilteredItems(updatedFiltered);
        inputRef.current?.focus();

    };

    const removeItem = (id: string | number) => {
        const newSelected = selectedItems.filter((item) => item.id !== id);
        onChange(newSelected);

        const updatedFiltered = items.filter(
            (i) =>
                i.label.toLowerCase().includes(inputValue.toLowerCase()) &&
                !newSelected.find((s) => s.id === i.id)
        );
        setFilteredItems(updatedFiltered);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(e.target as Node)
        ) {
            setFilteredItems([]);
        }
    };

    const handleTagKeyDown = (
        e: React.KeyboardEvent<HTMLDivElement>,
        id: string | number
    ) => {

        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            removeItem(id);
            inputRef.current?.focus();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            inputRef.current?.focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();

        }
    };


    return (
        <div className={styles.wrapper}
             ref={containerRef}
             role="combobox"
             aria-haspopup="listbox"
             aria-expanded={filteredItems.length > 0}>
            {selectedItems.map((item) => (
                <Tag
                    key={item.id}
                    label={item.label}
                    id={item.id}
                    onRemove={removeItem}
                    onKeyDown={handleTagKeyDown}
                />
            ))}
            <input
                type="text"
                className={styles.input}
                ref={inputRef}
                name="autocomplete-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}

                aria-autocomplete="list"
                aria-controls="autocomplete-list"
            />
            {filteredItems.length > 0 && (
                <ul className={styles.dropdown} id="autocomplete-list" role="listbox">
                    {filteredItems.map((item, index) => (
                        <li
                            key={item.id}
                            className={`${styles.item} ${index === highlightIndex ? styles.highlighted : ''}`}
                            onClick={() => selectItem(item)}
                            role="option"
                            aria-selected={index === highlightIndex}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Autocomplete;
