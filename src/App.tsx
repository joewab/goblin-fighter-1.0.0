import "./App.css";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { MonsterRef } from "./Interfaces/MonsterRef";
import { useInView } from "react-intersection-observer";
import cloud1 from "./assets/animated-storm.png";
import cloud2 from "./assets/animated-storm-2.png";
import FightArena from "./FightArea/FightArena";

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

  const [allMonsters, setAllMonsters] = useState<MonsterRef[]>([]);
  const [scrollStarted, setScrollStarted] = useState(false);

  return (
    <div className="App">
      <header ref={headerRef} className="App-header">
        <p>{title}</p>
      </header>
      <body className="App-body">
        <div className={`cloud-1 ${scrollStarted ? "animateCloud1" : ""}`}>
          <img src={cloud1} alt="cloud"/>
        </div>
        <div className={`cloud-2 ${scrollStarted ? "animateCloud2" : ""}`}>
          <img src={cloud2} alt="cloud"/>
        </div>
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
    </div>
  );
};

export default App;
