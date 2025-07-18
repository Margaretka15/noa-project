import React from 'react';
import styles from './Autocomplete.module.scss';
import { AutocompleteItem, AutocompleteProps } from './types';
import Tag from './Tag';
import { useAutocomplete } from './useAutocomplete';

const Autocomplete = <T extends AutocompleteItem>({
                                                      items,
                                                      selectedItems,
                                                      onChange,
                                                      placeholder = 'Type to search...',
                                                      allowCustom = true,
                                                  }: AutocompleteProps<T>) => {
    const {
        inputValue,
        setInputValue,
        highlightIndex,
        filteredItems,
        setIsFocused,
        containerRef,
        inputRef,
        handleKeyDown,
        selectItem,
        removeItem,
        handleTagKeyDown,
    } = useAutocomplete(items, selectedItems, onChange, allowCustom);

    return (
        <div
            className={styles.wrapper}
            ref={containerRef}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={filteredItems.length > 0}
        >
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
                autoComplete="off"
                spellCheck={false}
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
};

export default Autocomplete;
