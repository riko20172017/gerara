import React, { useState } from "react";

const InputTimer = ({ avalue, itemId, handleClick }) => {
  const [value, setValue] = useState(0);
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
        type="number"
        className="form-control text-center me-1"
        style={{ width: "100px" }}
        placeholder="Минуты"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        min="0"
        max="300"
      />
      <button
        className="btn btn-primary"
        onClick={() => handleClick(itemId, value)}
        // disabled={disabled[valve]}
      >
        Сохранить
      </button>
    </div>
  );
};

export default InputTimer;
