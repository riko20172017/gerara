import React, { useState, useEffect } from "react";

function Pamps() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Длительность полива</h1>
      </header>
      <div>
        <ul>
          <li>
            <span>Клаппанная группа 1</span>
            <span> 0 </span>
            <span> 0 </span>
            <button>Сохранить</button>
          </li>
          <li>
            <span>Клаппанная группа 2</span>
            <span> 0 </span>
            <span> 0 </span>
            <button>Сохранить</button>
          </li>
          <li>
            <span>Клаппанная группа 3</span>
            <span> 0 </span>
            <span> 0 </span>
            <button>Сохранить</button>
          </li>
          <li>
            <span>Клаппанная группа 4</span>
            <span> 0 </span>
            <span> 0 </span>
            <button>Сохранить</button>
          </li>
        </ul>
        <div>
          Общее время полива <span> 0 </span>
        </div>
      </div>
    </div>
  );
}
export default Pamps;
