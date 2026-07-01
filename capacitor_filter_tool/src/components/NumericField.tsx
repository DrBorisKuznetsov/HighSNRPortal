type NumericFieldProps = {
  label: string;
  suffix: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function NumericField({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
}: NumericFieldProps) {
  return (
    <label className="numeric-field">
      <span>{label}</span>
      <div className="numeric-control">
        <input
          type="number"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = Number(event.currentTarget.value);
            if (Number.isFinite(nextValue)) {
              onChange(nextValue);
            }
          }}
        />
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  );
}
