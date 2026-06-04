'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PAID_PLACEMENT_TYPE_OPTIONS, paidPlacementLabel } from '../constants';

interface SearchablePlacementTypeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export function SearchablePlacementTypeInput({
  value,
  onChange,
  disabled = false,
  id = 'placementType',
}: SearchablePlacementTypeInputProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = value ? paidPlacementLabel(value) : '';

  useEffect(() => {
    if (!open) {
      setSearch(displayValue);
    }
  }, [value, displayValue, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PAID_PLACEMENT_TYPE_OPTIONS;
    return PAID_PLACEMENT_TYPE_OPTIONS.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [search]);

  const trimmedSearch = search.trim();
  const showCustomOption =
    trimmedSearch.length > 0 &&
    !PAID_PLACEMENT_TYPE_OPTIONS.some(
      (o) =>
        o.label.toLowerCase() === trimmedSearch.toLowerCase() ||
        o.value.toLowerCase() === trimmedSearch.toLowerCase(),
    );

  const selectOption = (next: string) => {
    onChange(next);
    setOpen(false);
    setSearch(paidPlacementLabel(next));
  };

  return (
    <div className="mb-3 position-relative" ref={containerRef}>
      <label htmlFor={id} className="form-label">
        Placement type <span className="text-danger">*</span>
      </label>
      <input
        id={id}
        type="text"
        className="form-control"
        placeholder="Search or type placement type..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          if (!e.target.value.trim()) {
            onChange('');
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => {
            const trimmed = search.trim();
            if (trimmed && trimmed !== displayValue) {
              onChange(trimmed);
            }
            setOpen(false);
          }, 150);
        }}
        disabled={disabled}
        autoComplete="off"
        required
      />
      {open && !disabled && (
        <ul
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 1050, maxHeight: 220, overflowY: 'auto' }}
        >
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`list-group-item list-group-item-action ${value === opt.value ? 'active' : ''}`}
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
          {showCustomOption && (
            <li>
              <button
                type="button"
                className="list-group-item list-group-item-action list-group-item-primary"
                onClick={() => selectOption(trimmedSearch)}
              >
                Use custom: &quot;{trimmedSearch}&quot;
              </button>
            </li>
          )}
          {filtered.length === 0 && !showCustomOption && (
            <li className="list-group-item text-muted small">No matches</li>
          )}
        </ul>
      )}
      <p className="form-text mb-0">
        Pick from the list or type your own placement type if it is not listed.
      </p>
    </div>
  );
}
