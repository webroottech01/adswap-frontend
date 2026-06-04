'use client';

import { useEffect, useMemo, useState } from 'react';
import { BusinessCategory } from '../api';
import { buildCategoryTree, CategoryTreeNode } from '../utils/categoryTree';

interface SearchableCategorySelectProps {
  categories: BusinessCategory[];
  valueId?: number;
  valueName?: string;
  onChange: (categoryId: number, categoryName: string) => void;
  error?: string;
  loading?: boolean;
}

function flattenTree(nodes: CategoryTreeNode[], level = 0): { id: number; label: string; name: string }[] {
  const result: { id: number; label: string; name: string }[] = [];
  nodes.forEach((node) => {
    const prefix = level > 0 ? '— '.repeat(level) : '';
    result.push({ id: node.id, label: `${prefix}${node.name}`, name: node.name });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, level + 1));
    }
  });
  return result;
}

export function SearchableCategorySelect({
  categories,
  valueId,
  valueName,
  onChange,
  error,
  loading,
}: SearchableCategorySelectProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const options = useMemo(() => flattenTree(buildCategoryTree(categories)), [categories]);

  const selectedId = valueId ?? options.find((o) => o.name === valueName)?.id;
  const selectedOption = options.find((o) => o.id === selectedId);

  useEffect(() => {
    if (!isSearching && selectedOption) {
      setQuery(selectedOption.label.trim());
    }
  }, [selectedOption, isSearching]);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      o.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: number, name: string, label: string) => {
    onChange(id, name);
    setQuery(label.trim());
    setIsSearching(false);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Business Category <span className="text-danger">*</span></label>
      <input
        type="search"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        placeholder={loading ? 'Loading categories...' : 'Search or select a category'}
        value={query}
        disabled={loading}
        onFocus={() => setIsSearching(true)}
        onChange={(e) => {
          setIsSearching(true);
          setQuery(e.target.value);
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsSearching(false);
            if (selectedOption) {
              setQuery(selectedOption.label.trim());
            }
          }, 150);
        }}
      />
      {selectedOption && !isSearching && (
        <div className="form-text text-success">Selected: {selectedOption.name}</div>
      )}
      {(isSearching || query.length > 0) && !loading && (
        <ul
          className="list-group mt-2 overflow-auto border rounded"
          style={{ maxHeight: 200 }}
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="list-group-item text-muted small">No categories match your search</li>
          ) : (
            filtered.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  className={`list-group-item list-group-item-action small text-start ${
                    o.id === selectedId ? 'active' : ''
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(o.id, o.name, o.label)}
                >
                  {o.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
