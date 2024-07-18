export interface Monster {
    index: string;
    name: string;
    size: string;
    type: string;
    alignment: string;
    armor_class: ArmorClass[];
    hit_points: number;
    hit_dice: string;
    hit_points_roll: string;
    speed: Speed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    proficiencies: ProficiencyDetails[];
    damage_vulnerabilities: string[];
    damage_resistances: string[];
    damage_immunities: string[];
    condition_immunities: string[];
    senses: Senses;
    languages: string;
    challenge_rating: number;
    proficiency_bonus: number;
    xp: number;
    special_abilities: SpecialAbility[];
    actions: Action[];
    legendary_actions: LegendaryAction[];
    image: string;
    url: string;
}

export interface ArmorClass {
    type: string;
    value: number;
}

export interface Speed {
    walk: string;
    fly: string;
    swim: string;
}

export interface Proficiency {
    index: string;
    name: string;
    url: string;
}

export interface ProficiencyDetails {
    value: number;
    proficiency: Proficiency;
}

export interface Senses {
    blindsight: string;
    darkvision: string;
    passive_perception: number;
}

export interface Usage {
    type: string;
    times?: number;
    rest_types?: string[];
    dice?: string;
    min_value?: number;
}

export interface SpecialAbility {
    name: string;
    desc: string;
    usage?: Usage;
}

export interface ActionDamageType {
    index: string;
    name: string;
    url: string;
}

export interface ActionDamage {
    damage_type: ActionDamageType;
    damage_dice: string;
}

export interface ActionDCType {
    index: string;
    name: string;
    url: string;
}

export interface ActionDC {
    dc_type: ActionDCType;
    dc_value: number;
    success_type: string;
}

export interface Action {
    name: string;
    desc: string;
    multiattack_type?: string;
    actions: {
        action_name: string;
        count: number;
        type: string;
    }[];
    attack_bonus: number;
    damage: ActionDamage[];
    dc: ActionDC;
}

export interface LegendaryAction {
    name: string;
    desc: string;
    dc?: ActionDC;
    damage?: ActionDamage[];
}
