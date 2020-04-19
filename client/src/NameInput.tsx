import React, { useEffect, useState } from "react";
import "./WikipediaPageView.css";

interface Props {
  onAccept: (name: string) => void;
}

function NameInput(props: Props) {
  const [name, setName] = useState("");

  return (
    <div>
      <h1>Choose a name</h1>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
      />
      <button onClick={() => props.onAccept(name)}>Accept</button>
    </div>
  );
}

export default NameInput;
