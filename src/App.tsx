import "./App.css";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { MonsterRef } from "./Interfaces/MonsterRef";
import { useInView } from "react-intersection-observer";
import FightArena from "./FightArena/FightArena";
import React from "react";
interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {
  useEffect(() => {
    getMonsters();
  }, []);

  const getMonsters = () => {
    axios({
      method: "GET",
      url: "https://www.dnd5eapi.co/api/monsters",
    }).then((response) => {
      setAllMonsters(response.data.results);
    });
  };

  const { ref: areRef, inView: areVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px"
  });
  const { ref: youRef, inView: youVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px"
  });
  const { ref: readyRef, inView: readyVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px"
  });
  const { ref: toRef, inView: toVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px"
  });
  const { ref: battleRef, inView: battleVisible } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px"
  });

  const [allMonsters, setAllMonsters] = useState<MonsterRef[]>([]);

  return (
    <div className="App">
      <header className="App-header">
        <p>{title}</p>
      </header>
      <body className="App-body">
        <div className="title-container">
          <div ref={areRef} className="title">
            <span className={`at-rest`}>
              Welcome to Goblin Fighter! Please choose two monsters, then click the fight button.
            </span>
          </div>
        </div>
        <FightArena allMonsters={allMonsters} />
      </body>
    </div>
  );
};

export default App;
