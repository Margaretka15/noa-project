import { useState, useEffect, useRef } from 'react';
import { AutocompleteItem } from './types';

export const useAutocomplete = <T extends AutocompleteItem>(
    items: T[],
    selectedItems: T[],
    onChange: (items: T[]) => void,
    allowCustom: boolean = true
) => {
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
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setFilteredItems([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectItem = (item: T) => {
        const newSelected = [...selectedItems, item];
        onChange(newSelected);
        setInputValue('');
        inputRef.current?.focus();
    };

    const removeItem = (id: string | number) => {
        const newSelected = selectedItems.filter((item) => item.id !== id);
        onChange(newSelected);
    };

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
                    label: inputValue,
                } as T;
                selectItem(newItem);
            }
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
        }
    };

    return {
        inputValue,
        setInputValue,
        highlightIndex,
        filteredItems,
        isFocused,
        setIsFocused,
        containerRef,
        inputRef,
        handleKeyDown,
        selectItem,
        removeItem,
        handleTagKeyDown,
    };
};
