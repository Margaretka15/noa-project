export type AutocompleteItem = {
    id: string | number;
    label: string;
};

export type AutocompleteProps<T extends AutocompleteItem> = {
    items: T[];
    selectedItems: T[];
    onChange: (items: T[]) => void;
    placeholder?: string;
    allowCustom?: boolean;
};
