import './MonsterCard.css';
import { Monster } from './Interfaces/Monster';
import { Component, FC, useEffect, useState } from 'react';

interface MonsterProps {
    monster: Monster | undefined;
  }

const MonsterCard: FC<MonsterProps> = ({ monster }) => {
  
    const showMonster = () => {
        console.log(monster);
    }

    if(!monster){
        return (
            <div>
                Choose Your Fighter!
            </div>
        )
    }

    return(
        <div className='monster-card'>
            <h1>{monster.index}</h1>
            <button onClick={showMonster}>show stats</button>
        </div>
    );
}

export default MonsterCard;