import React from 'react';
export const motionColor = {
    bgColor: "bg-yellow-500",
    textColor: "text-white"
}
export const controlColor = {
    bgColor: "bg-blue-500",
    textColor: "text-white"
}

export const MOVE_STEPS = "MoveSteps"
export const TURN_DEGREES = "TurnDegrees"
export const GO_TO = "GoTo"
export const REPEAT = "Repeat"
export default {
    Motion: [
        {
           
            type: MOVE_STEPS,
            defaultPayload: { steps: 10 }
        },
        {
           
            type: TURN_DEGREES,
            defaultPayload: { degree: -15 }
        },
        {
          
            type: GO_TO,
            defaultPayload: { x: 100, y: 100 }
        },
    ],
    Control: [
        {
            type: REPEAT,
            defaultPayload: {}
        },
    ],
}