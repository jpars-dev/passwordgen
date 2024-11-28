'use client';

const Slider = ({ value, onChange, min = 0, max = 75, label }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
        <span className="label-text-alt">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="range range-primary"
      />
      <div className="w-full flex justify-between text-xs px-2 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
