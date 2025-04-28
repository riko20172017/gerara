import React, { useState } from "react";

const InputTimer = ({ avalue, itemId, type, min, max, state, handleClick }) => {
  const [value, setValue] = useState(state);

  return (
    <div className="d-flex align-items-center input-group-lg">
      <span
        className="input-group-text justify-content-center me-1"
        id="inputGroup-sizing-lg"
        style={{ width: "100px" }}
      >
        {avalue}
      </span>
      <input
        type={type ? type : "number"}
        className="form-control text-center me-1"
        style={{ width: "100px" }}
        placeholder="Минуты"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min={min}
        max={max}
      />
      <button
        className="btn btn-primary"
        onClick={() => handleClick(itemId, value)}
        disabled={avalue === value}
      >
        Сохранить
      </button>
    </div>
  );
};

export default InputTimer;
