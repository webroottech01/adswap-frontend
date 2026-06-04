'use client';

interface ChipMultiSelectProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function ChipMultiSelect({ label, options, value, onChange, error }: ChipMultiSelectProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <div className="d-flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => toggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
