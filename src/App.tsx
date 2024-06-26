import "./App.css";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { MonsterRef } from "./Interfaces/MonsterRef";
import { useInView } from "react-intersection-observer";
import FightArena from "./FightArena/FightArena";
import Clouds from "./Clouds/Clouds";

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

  const { ref: headerRef } = useInView({
    threshold: 1,
    root: null,
    rootMargin: "0px",
    onChange: (inView) => {
      setScrollStarted(!inView);
    }
  });
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
  const { ref: disableClouds } = useInView({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
    onChange: (inView) => {
      inView ? setArenaInView(true) : null;
    }
  });

  const [allMonsters, setAllMonsters] = useState<MonsterRef[]>([]);
  const [scrollStarted, setScrollStarted] = useState(false);
  const [arenaInView, setArenaInView] = useState(false);

  return (
    <div className="App">
      <header ref={headerRef} className="App-header">
        <p>{title}</p>
      </header>
      <body className="App-body">
        <Clouds scrollStarted={scrollStarted} arenaInView={arenaInView} />
        <div ref={areRef} className="title top">
          <span className={`at-rest ${areVisible ? "animateZoom" : ""}`}>
            Are
          </span>
        </div>
        <div ref={youRef} className="title">
          <span className={`at-rest ${youVisible ? "animateZoom" : ""}`}>
            You
          </span>
        </div>
        <div ref={readyRef} className="title">
          <span className={`at-rest ${readyVisible ? "animateZoom" : ""}`}>
            Ready
          </span>
        </div>
        <div ref={toRef} className="title">
          <span className={`at-rest ${toVisible ? "animateZoom" : ""}`}>
            To
          </span>
        </div>
        <div ref={battleRef} className="title">
          <span className={`at-rest ${battleVisible ? "animateBattle" : ""}`}>
            Battle?
          </span>
        </div>
        <FightArena allMonsters={allMonsters} />
      </body>
      <div ref={disableClouds}></div>
    </div>
  );
};

export default App;
