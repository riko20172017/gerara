import React, { useState } from "react";

const InputTimer = ({
  label,
  avalue,
  itemId,
  type,
  min,
  max,
  state,
  handleClick,
}) => {
  const [value, setValue] = useState(state);

  return (
    <div className="input-group-lg d-flex flex-column flex-sm-row">
      <div className="d-flex flex-row justify-content-center flex-fill">
        <span
          className="input-group-text bg-dark text-light rounded-0 flex-fill justify-content-center"
          id="inputGroup-sizing-lg"
        >
          {label}
        </span>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <input
          type={type ? type : "number"}
          className="form-control text-center bg-dark text-light rounded-0"
          style={{ width: "100px" }}
          value={avalue}
          disabled="disabled"
        />
        <input
          type={type ? type : "number"}
          className="form-control text-center bg-dark text-light rounded-0"
          style={{ width: "100px" }}
          placeholder="Минуты"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={min}
          max={max}
        />
        <button
          className="btn btn-dark rounded-0 btn-outline-light"
          onClick={() => handleClick(itemId, value)}
          disabled={avalue === value}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default InputTimer;
