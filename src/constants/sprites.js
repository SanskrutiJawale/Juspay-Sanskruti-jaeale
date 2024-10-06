import { v4 as uuid } from 'uuid'
const catId = uuid()
const dogId = uuid()
const birdId = uuid()

export const SPRITE_WIDTH = 85;
export const SPRITE_HEIGHT = 85;
export default [
    {
        id: catId,
        name: "cat",
        position: { x: 0, y: 0 },
        rotation: 0,
        actions: [],
    },
    {
        id: dogId,
        name: "dog",
        position: { x: 140, y: 0 },
        rotation: 0,
        actions: [],
    },
    {
        id: birdId,
        name: "bird",
        position: { x: 140, y: 0 },
        rotation: 0,
        actions: [],
    }
]