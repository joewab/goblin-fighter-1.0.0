import './MonsterCard.css';
import { Monster } from './Interfaces/Monster';
import { Component, FC, useEffect, useState } from 'react';

interface MonsterProps {
    monster: Monster | undefined;
  }

const MonsterCard: FC<MonsterProps> = ({ monster }) => {

    if(!monster){
        return (
            <div className='monsterStat'>
                Choose Your Fighter!
            </div>
        )
    }

    return(
        <div className='monster-card'>
            <div className='monsterTitle'>{monster.index}</div>
            <div className='monsterStat'>AC: {monster.armor_class[0].value}</div>
            <div className='monsterStat'>HP: {monster.hit_points}</div>
            <div className='monsterStat'>CR: {monster.challenge_rating}</div>
        </div>
    );
}

export default MonsterCard;