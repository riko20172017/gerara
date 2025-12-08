import React, { useEffect } from "react";
import Back from "../components/gui/Back/Back";
import { usePamps, useReady, useWSSend } from "../websocket/WsSelectors";

function Areas() {
  const pamps = usePamps();
  const send = useWSSend();
  const ready = useReady();

  //Handle WebSocket connection state
  useEffect(() => {
    if (ready) {
      send({ action: "get_pamps" });
      const timerId = setInterval(() => {
        send({ action: "get_pamps" });
      }, 1000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [ready]);

  const filename = pamps?.valves
    ?.map(({ name, status }, index) => {
      if (status === "on") {
        return name;
      } else {
        return 0;
      }
    })
    .reverse()
    .join("");

  return (
    <div>
      <div className="container mt-3">
        <div className="py-4">
          <div className="row">
            <div className="col-12 col-sm-1">
              <Back></Back>
            </div>
            <div className="col-12 col-sm-11">
              <h1 class="display-6 text-center">Display 6</h1>
            </div>
          </div>
          <div className="row g-4">
            <div className="col">
              <img
                className="img-fluid"
                src={process.env.PUBLIC_URL + `/img/${filename}.png`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Areas;
