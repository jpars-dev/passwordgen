'use client';

const Toggle = ({ label, checked, onChange }) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={checked}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Toggle;
