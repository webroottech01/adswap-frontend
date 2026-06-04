'use client';

import { useMemo, useState } from 'react';
import { BusinessCategory } from '../api';
import { CategoryChecklistOption, flattenChildCategories } from '../utils/categoryOptions';

interface SearchableCategoryChecklistProps {
  categories: BusinessCategory[];
  value: number[];
  onChange: (ids: number[]) => void;
  label: string;
  error?: string;
  loading?: boolean;
}

export function SearchableCategoryChecklist({
  categories,
  value,
  onChange,
  label,
  error,
  loading,
}: SearchableCategoryChecklistProps) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => flattenChildCategories(categories), [categories]);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.parentName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = options.filter((o) => value.includes(o.id));

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const remove = (id: number) => onChange(value.filter((x) => x !== id));

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="search"
        className="form-control mb-2"
        placeholder={loading ? 'Loading...' : 'Search categories...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={loading}
      />

      {selectedOptions.length > 0 && (
        <div className="mb-2 d-flex flex-wrap gap-1 align-items-center">
          <span className="small text-muted">{selectedOptions.length} selected:</span>
          {selectedOptions.map((o) => (
            <span key={o.id} className="badge bg-primary d-inline-flex align-items-center gap-1">
              {o.name}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: '0.45rem' }}
                aria-label={`Remove ${o.name}`}
                onClick={() => remove(o.id)}
              />
            </span>
          ))}
        </div>
      )}

      <div
        className="border rounded p-2 overflow-auto"
        style={{ maxHeight: 240 }}
        role="group"
        aria-label={label}
      >
        {loading ? (
          <p className="small text-muted mb-0">Loading categories...</p>
        ) : filtered.length === 0 ? (
          <p className="small text-muted mb-0">No categories match your search</p>
        ) : (
          filtered.map((o) => (
            <div key={o.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-check-${o.id}`}
                checked={value.includes(o.id)}
                onChange={() => toggle(o.id)}
              />
              <label className="form-check-label small" htmlFor={`cat-check-${o.id}`}>
                {o.label}
              </label>
            </div>
          ))
        )}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
