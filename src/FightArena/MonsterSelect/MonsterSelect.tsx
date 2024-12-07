import { Monster } from "../../Interfaces/Monster";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { MonsterRef } from "../../Interfaces/MonsterRef";
import axios from "axios";
import { rollDice } from "../../RollDice";

interface AllMonsters {
  allMonsters: MonsterRef[];
  setCurrentMonster: (monster: Monster) => void;
  setClearText: Dispatch<SetStateAction<boolean>>;
  setTurn: Dispatch<SetStateAction<number>>;
  setMonst1HP: Dispatch<SetStateAction<number>>;
  setMonst2HP: Dispatch<SetStateAction<number>>;
  setHpInit: Dispatch<SetStateAction<boolean>>;
  setButtonText: Dispatch<SetStateAction<string>>;
}

const MonsterSelect: FC<AllMonsters> = ({ allMonsters, setCurrentMonster, setClearText, setTurn, setMonst1HP, setMonst2HP, setHpInit, setButtonText }) => {

  const [searchVal, setSearchVal] = useState("");
  const [filteredMonsters, setFilteredMonsters] = useState<MonsterRef[]>();

  const monsterSearch = (event: any) => {
    setFilteredMonsters(() => {
      setSearchVal(event.target.value)      
      if(event.target.value !== ''){
        const result = allMonsters.filter((monster) => {
          return monster.name.toLowerCase().startsWith(event.target.value.toLowerCase())
        });            
        return result;
      };
    });
  };

  const chooseRandomMonster = () => {
    const randomIndex = rollDice(allMonsters.length);
    setHelper(allMonsters[randomIndex].name);
  };

  const setHelper = (monsterName: string) => {
    if (allMonsters) {
      for (let monst of allMonsters) {
        if (monsterName === monst.name) {
          axios({
            method: "GET",
            url: `https://www.dnd5eapi.co${monst.url}`,
          }).then((response) => {
              setCurrentMonster(response?.data);
              setFilteredMonsters([]);
              setSearchVal(monsterName);
              setClearText(true);
              setTurn(0);
              setMonst1HP(1);
              setMonst2HP(1);
              setHpInit(false);
              setButtonText('Fight!')
          });
        }
      }
    }
  };

  return (
      <div className="monster-select">
        <div>
          <button className="choose-random-button" onClick={() => chooseRandomMonster()}>Choose Random</button>
        </div>

        <input
          onChange={(e) => monsterSearch(e)}
          value={searchVal}
          type="text"
          name="monster1-search"
          id="monster1-search"
          placeholder="Search Monsters"
        />
        <ul className="monster-list">
          {filteredMonsters?.map((monster) => {
            return (
              <li
                key={monster.index}
                className="list-monster"
                value={monster.name}
                onClick={(event: any) => setHelper(event.target.innerText)}
              >
                {" "}
                {monster.name}{" "}
              </li>
            );
          })}
        </ul>
      </div>
  );
};

export default MonsterSelect;
