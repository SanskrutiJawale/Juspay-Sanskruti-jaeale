// components/Sidebar.js
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { move, rotate, goTo, resetSprites, repeatAction } from '../redux/spritesSlice';
import sidebarBlocks from "../constants/sidebarBlocks";
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
    const dispatch = useDispatch();
    const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);

    const [steps, setSteps] = useState(10);
    const [degree, setDegree] = useState(10);
    const [x, setX] = useState(15);
    const [y, setY] = useState(15);

    const handleDragStart = (e, actionType, payload, text) => {
        e.dataTransfer.setData('actionType', actionType);
        e.dataTransfer.setData('payload', JSON.stringify(payload));
    };

    const handleMove = () => {
        if (selectedSpriteId) {
            dispatch(move({ steps: Number(steps), spriteId: selectedSpriteId }));
        }
    };

    const handleRotate = () => {
        if (selectedSpriteId) {
            dispatch(rotate({ degree: Number(degree), spriteId: selectedSpriteId }));
        }
    };

    const handleGoTo = () => {
        if (selectedSpriteId) {
            dispatch(goTo({ x: Number(x), y: Number(y), spriteId: selectedSpriteId }));
        }
    };

    const handleRepeatAnimation = () => {
        if (selectedSpriteId) {
            const times = 5; // Number of times to repeat the action
            const interval = 500; // Time between repeats in ms
            
            // Define which action to repeat and its payload
            dispatch(repeatAction({
                spriteId: selectedSpriteId,
                times,
                interval,
                actionType: 'MoveSteps', 
                payload: { steps: 10 }   
            }));
        }
    };

    const handleReset = () => {
        dispatch(resetSprites());

        // Reset local state
        setSteps(10);
        setDegree(10);
        setX(15);
        setY(15);
    };
    

    return (
        <div className="w-60 flex-none h-full overflow-y-auto p-2 border-right border-gray-200">
            {Object.keys(sidebarBlocks).map(key => (
                <div key={key} className="mb-3">
                    <div className="font-weight-bold">{key}</div>
                    {sidebarBlocks[key].map((block, index) => (
                        <div key={index} className="my-2">
                            <div className="mt-1 d-flex align-items-center">
                                {block.type === "MoveSteps" && (
                                    <div
                                        className="input-group"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, 'MoveSteps', { steps: Number(steps) }, 'Move')}
                                    >
                                        <input
                                            type="number"
                                            value={steps}
                                            onChange={(e) => setSteps(e.target.value)}
                                            className="form-control"
                                        />
                                        <button
                                            onClick={handleMove}
                                            className="btn btn-success"
                                        >
                                            Move Steps
                                        </button>
                                    </div>
                                )}
                                {block.type === "TurnDegrees" && (
                                    <div
                                        className="input-group"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, 'TurnDegrees', { degree: Number(degree) }, 'Turn')}
                                    >
                                        <input
                                            type="number"
                                            value={degree}
                                            onChange={(e) => setDegree(e.target.value)}
                                            className="form-control"
                                        />
                                        <button
                                            onClick={handleRotate}
                                            className="btn btn-warning"
                                        >
                                            Turn Degrees
                                        </button>
                                    </div>
                                )}
                                {block.type === "GoTo" && (
                                    <div
                                        className="input-group"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, 'GoTo', { x: Number(x), y: Number(y) }, 'Go To')}
                                    >
                                        <input
                                            type="number"
                                            value={x}
                                            onChange={(e) => setX(e.target.value)}
                                            placeholder="x"
                                            className="form-control"
                                        />
                                        <input
                                            type="number"
                                            value={y}
                                            onChange={(e) => setY(e.target.value)}
                                            placeholder="y"
                                            className="form-control"
                                        />
                                        <button
                                            onClick={handleGoTo}
                                            className="btn btn-primary"
                                        >
                                            Go To X,Y
                                        </button>
                                    </div>
                                )}
                                {block.type === "Repeat" && (
                                    <div
                                        className="input-group"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, 'Repeat', {}, 'Repeat Animation')}
                                    >
                                        <button
                                            onClick={handleRepeatAnimation}
                                            className="btn btn-danger"
                                        >
                                            Repeat Animation
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <button className="btn btn-secondary mt-3" onClick={handleReset}>
                Reset All Sprites
            </button>
        </div>
    );
    
};



export default Sidebar;
