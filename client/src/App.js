import useWebSocket, { ReadyState } from "react-use-websocket"
import React, { useState, useEffect } from 'react';

function App() {
  const WS_URL = "ws://localhost:7000"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          channel: "general-chatroom",
        },
      })
    }
  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`)
  }, [lastJsonMessage])

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Длительность полива
        </h1>
      </header>
      <div>
        <ul>
          <li><span>Клаппанная группа 1</span><span> 0 </span><span> 0 </span><button>Сохранить</button></li>
          <li><span>Клаппанная группа 2</span><span> 0 </span><span> 0 </span><button>Сохранить</button></li>
          <li><span>Клаппанная группа 3</span><span> 0 </span><span> 0 </span><button>Сохранить</button></li>
          <li><span>Клаппанная группа 4</span><span> 0 </span><span> 0 </span><button>Сохранить</button></li>
        </ul>
        <div>Общее время полива <span> 0 </span></div>
      </div>
    </div>
  );
}
export default App;
