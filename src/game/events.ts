export enum Events {
    PRESS_UP = "p_up",
    RELEASE_UP = "r_up",
    PRESS_DOWN = "p_dn",
    RELEASE_DOWN = "r_dn",
    PRESS_RIGHT = "p_ri",
    RELEASE_RIGHT = "r_ri",
    PRESS_LEFT= "p_le",
    RELEASE_LEFT= "r_le",
}

export interface Event {
    type: Events,
    time: number,
}

export interface PlayerEvent extends Event {
    player: number,
}
