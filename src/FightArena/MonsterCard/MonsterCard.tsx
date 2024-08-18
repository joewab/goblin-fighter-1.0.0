import './MonsterCard.css';
import { Monster } from '../../Interfaces/Monster';
import { FC } from 'react';

interface MonsterProps {
    monster: Monster | undefined;
    hpInit: boolean;
    monstHP: number;
  }

const MonsterCard: FC<MonsterProps> = ({ monster, hpInit, monstHP }) => {

    if(!monster){
        return (
            <div className='monsterStat'>
                Choose Your Fighter!
            </div>
        )
    }

    //TBD add images
    // const monsturl = `https://www.dnd5eapi.co${monster.image}`;

    return(
        <div className='monster-card'>
            <div className='monsterTitle'>{monster.name}</div>
            <div className='monsterStat'>AC: {monster.armor_class[0].value}</div>
            <div className='monsterStat'>HP: {hpInit ? monstHP : monster.hit_points}</div>
            <div className='monsterStat'>CR: {monster.challenge_rating}</div>
        </div>
    );
}

export default MonsterCard;