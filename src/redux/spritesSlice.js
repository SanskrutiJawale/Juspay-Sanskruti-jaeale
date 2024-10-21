    import { createSlice } from '@reduxjs/toolkit';
    import allSprites, { SPRITE_HEIGHT, SPRITE_WIDTH } from '../constants/sprites'
import { act } from 'react';
    const initialState = {
        sprites: [
            allSprites[0]
        ],
        selectedSpriteId: allSprites[0].id,
        showCollisionAnimation: false,
        collisionHandled: false,
    };
    



    const spritesSlice = createSlice({
        name: 'sprites',
        initialState,
        reducers: {
            addSprite: (state, action) => {
                state.sprites.push({
                    id: action.payload.id,
                    name: action.payload.name,
                    position: { x: 0, y: 0 },
                    rotation: 0,
                    actions: [],
                });
                state.selectedSpriteId = action.payload.id
            },
            selectSprite: (state, action) => {
                state.selectedSpriteId = action.payload;
            },
            addActionToSprite: (state, action) => {
                const { spriteId, actionType, actionText, payload } = action.payload;
                const sprite = state.sprites.find(sprite => sprite.id === spriteId);
                if (sprite) {
                    sprite.actions.push({ type: actionType, text: actionText, payload });
                }
            },
            move: (state, action) => {
                console.log("inside");
                const { steps, spriteId } = action.payload;
                const checkCollision = (sprite1, sprite2) => {
                    if (!sprite1.position || !sprite2.position) return false;
                    const { x: x1, y: y1 } = sprite1.position;
                    const { x: x2, y: y2 } = sprite2.position;
            
                    const distanceX = Math.abs(x1 - x2);
                    const distanceY = Math.abs(y1 - y2);
            
                    // Check if sprites overlap considering their width and height
                    return distanceX <=200 && distanceY <= 200;
                };
            
                let collisionDetected = false;
            
                // Check for collisions between all sprites
                for (let i = 0; i < state.sprites.length; i++) {
                    for (let j = i + 1; j < state.sprites.length; j++) {
                        if (checkCollision(state.sprites[i], state.sprites[j])) {
                            collisionDetected = true; 
                            break; 
                        }
                    }
                    if (collisionDetected) break; // Exit outer loop if collision detected
                }
            
                const sprite = state.sprites.find((s) => s.id === spriteId); // Find the sprite to move
            
                if (!collisionDetected) {
                    // If no collision, move all sprites
                    state.sprites.forEach((s) => {
                        if (s) {
                            const direction = s.moveDirection || 1;
                            s.position.x += Math.cos((s.rotation * Math.PI) / 180) * steps * direction;
                            s.position.y -= Math.sin((s.rotation * Math.PI) / 180) * steps * direction;
                        }
                    });
                } else {
                    // If collision detected, move the specified sprite and the second sprite in the opposite direction
                    if (sprite) {
                        const direction = sprite.moveDirection || 1; // Use the sprite's moveDirection (default to 1 if undefined)
                        sprite.position.x += Math.cos((sprite.rotation * Math.PI) / 180) * steps * direction;
                        sprite.position.y -= Math.sin((sprite.rotation * Math.PI) / 180) * steps * direction;
                    }
            
                    // Move the other sprite in the opposite direction
                    const otherSprite = state.sprites.find((s) => s.id !== spriteId); // Find another sprite to move
                    if (otherSprite) {
                        const oppositeDirection = -1 * (otherSprite.moveDirection || 1); // Reverse the direction
                        otherSprite.position.x += Math.cos((otherSprite.rotation * Math.PI) / 180) * steps * oppositeDirection;
                        otherSprite.position.y -= Math.sin((otherSprite.rotation * Math.PI) / 180) * steps * oppositeDirection;
                    }
                }
            },
            
            goTo: (state, action) => {
                const { x, y, spriteId } = action.payload;
                const sprite = state.sprites.find((s) => s.id === spriteId)
                sprite.position.x = x;
                sprite.position.y = y;
            },
            rotate: (state, action) => {
                const { degree, spriteId } = action.payload;
            
                // Function to check for collisions between two sprites
                const checkCollision = (sprite1, sprite2) => {
                    const distanceX = Math.abs(sprite1.position.x - sprite2.position.x);
                    const distanceY = Math.abs(sprite1.position.y - sprite2.position.y);
                    const collisionDistance = 10; // Define your collision threshold
                    return distanceX <= collisionDistance && distanceY <= collisionDistance;
                };
            
                // Find the sprite to rotate
                const spriteToRotate = state.sprites.find((s) => s.id === spriteId);
            
                // Check for collisions between the sprite to rotate and all other sprites
                let collisionDetected = false;
            
                for (let i = 0; i < state.sprites.length; i++) {
                    if (state.sprites[i].id !== spriteId && checkCollision(spriteToRotate, state.sprites[i])) {
                        collisionDetected = true; // Set flag if a collision is found
                        break; // Exit loop on first collision detection
                    }
                }
            
                if (!collisionDetected) {
                    // If no collision detected, rotate only the selected sprite
                    state.sprites.forEach((sprite) => {
                        if (sprite) {
                            sprite.rotation += degree; // Rotate all sprites by the specified degree
                        }
                    });
                  
                } else {
                    // If collision detected, perform actions for multiple sprites
                    if (spriteToRotate) {
                        spriteToRotate.rotation += degree;
                    }
                    
                }
            },
            
            deleteAction: (state, action) => {
                const { index } = action.payload;
                const sprite = state.sprites.find((s) => s.id === state.selectedSpriteId)
                sprite.actions.splice(index, 1)
            },
            resetSprites: (state) => {
                // Reset all sprites to their initial position, rotation, and steps
                state.sprites.forEach((sprite, index) => {
                    const initialSprite = allSprites.find(s => s.id === sprite.id); // Match by ID or however you identify initial states
            
                    if (initialSprite) { // Check if the initial sprite exists
                        sprite.position.x = initialSprite.position.x; // Reset to initial x
                        sprite.position.y = initialSprite.position.y; // Reset to initial y
                        sprite.rotation = initialSprite.rotation; // Reset to initial rotation
                        sprite.actions = []; // Clear actions if needed
                    }
                });
            },
            toggleCollision: (state, originalAction) => {
                const { showCollisionAnimation } = originalAction.payload;
                state.showCollisionAnimation = showCollisionAnimation;
                console.log('Action received in toggleCollision:', originalAction);
                
                if (showCollisionAnimation && state.sprites.length >= 2) {
                    // Set a flag to prevent recursive calls
                    let movedSprites = new Set();
                    
                    for (let i = 0; i < state.sprites.length; i++) {
                        for (let j = i + 1; j < state.sprites.length; j++) {
                            const spriteId1 = state.sprites[i].id;
                            const spriteId2 = state.sprites[j].id;
            
                            // Print sprite IDs for debugging
                            console.log(`Checking collision between ${spriteId1} and ${spriteId2}`);
            
                            // Pass the original action along with the sprite IDs
                            const collisionCheckAction = {
                                payload: {
                                    spriteId1,
                                    spriteId2,
                                    originalAction: originalAction, // Use originalAction instead of action
                                },
                            };
            
                            // Check collision and swap actions if needed
                            spritesSlice.caseReducers.checkCollisionAndSwap(state, collisionCheckAction);
                        }
                    }
            
                    // Automatically move sprites if collision animation is enabled
                    state.sprites.forEach(sprite => {
                        // Only move if the sprite has actions and hasn't been moved in this cycle
                        if (sprite.actions.length > 0 && !movedSprites.has(sprite.id)) {
                            const moveAction = {
                                type: 'move',
                                payload: { steps: 10 }, // or any step size you want
                            };
                            console.log(`Automatically moving sprite ${sprite.id}:`, moveAction);
                            spritesSlice.caseReducers.performAction(state, { payload: { spriteId: sprite.id, action: moveAction } });
                            
                            // Mark sprite as moved
                            movedSprites.add(sprite.id);
                        }
                    });
                }
            },
            
            checkCollisionAndSwap: (state, action) => {
                const { spriteId1, spriteId2, originalAction } = action.payload;
                console.log('Original Action:', originalAction);
            
                const sprite1 = state.sprites.find((s) => s.id === spriteId1);
                const sprite2 = state.sprites.find((s) => s.id === spriteId2);
            
                if (!sprite1 || !sprite2) {
                    console.error(`One of the sprites not found: ${spriteId1} or ${spriteId2}`);
                    return;
                }
            
                const checkCollision = (sprite1, sprite2) => {
                    // Collision checking logic
                };
            
                if (checkCollision(sprite1, sprite2) && state.showCollisionAnimation) {
                    console.log(`Collision detected between ${spriteId1} and ${spriteId2}`);
            
                    // Swap sprite actions immutably
                    const newActions1 = [...sprite2.actions];
                    const newActions2 = [...sprite1.actions];
            
                    return {
                        ...state,
                        sprites: state.sprites.map(sprite => 
                            sprite.id === spriteId1 ? { ...sprite, actions: newActions1 } :
                            sprite.id === spriteId2 ? { ...sprite, actions: newActions2 } :
                            sprite
                        ),
                    };
                }
            },
            
            
            performAction: (state, action) => {
                const { spriteId, action: spriteAction } = action.payload;
                const sprite = state.sprites.find((s) => s.id === spriteId);
            
                if (sprite) {
                    if (sprite.isMoving) {
                        console.warn(`Sprite ${spriteId} is already moving. Skipping this action.`);
                        return; 
                    }
                    
                    
                    sprite.isMoving = true;
            
                    switch (spriteAction.type) {
                        case 'move':
                const moveSprite = async () => {
                    for (let i = 0; i < 20; i++) {
                        console.log(`Sprite ${spriteId} moving ${spriteAction.payload.steps} steps (iteration ${i + 1}).`);
                        
                        // Call the move reducer directly (update the state here)
                        spritesSlice.caseReducers.move(state, { payload: { steps: spriteAction.payload.steps, spriteId } });
                        
                        console.log(`Sprite ${spriteId} has moved (iteration ${i + 1}).`); // Log after action

                        // Delay of 100ms before the next iteration
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                };

                moveSprite(); // Start the movement process asynchronously
                break;
                        case 'rotate':
                            console.log(`Sprite ${spriteId} rotating by ${spriteAction.payload.degree} degrees.`);
                            spritesSlice.caseReducers.rotate(state, { payload: { degree: spriteAction.payload.degree, spriteId: spriteId } });
                            console.log(`Sprite ${spriteId} has rotated.`); // Log after action
                            break;
                        case 'goTo':
                            console.log(`Sprite ${spriteId} moving to (${spriteAction.payload.x}, ${spriteAction.payload.y}).`);
                            spritesSlice.caseReducers.goTo(state, { payload: { x: spriteAction.payload.x, y: spriteAction.payload.y, spriteId: spriteId } });
                            console.log(`Sprite ${spriteId} has moved to new position.`); // Log after action
                            break;
                        default:
                            console.log(`Unknown action type for sprite ${spriteId}:`, spriteAction.type);
                            // Handle other action types
                            break;
                    }
            
                    // Reset the moving flag after a short delay or immediately based on your game logic
                    setTimeout(() => {
                        sprite.isMoving = false;
                    }, 100); // Adjust the delay as needed
                }
            },
            
 
            
            resetCollisionHandled: (state) => {
                state.collisionHandled = false;
            },
            updateActionValue: (state, action) => {
                const sprite = state.sprites.find((s) => s.id === state.selectedSpriteId);
                const { index, field, value } = action.payload;
                sprite.actions[index]['payload'][field] = value
            },
            repeatAction: (state, action) => {
                const { spriteId, times, actionType, payload } = action.payload;
            
                // Log the entire payload to check what's being passed
                console.log("Action payload:", action.payload);
            
                // Check if spriteId exists
                if (!spriteId) {
                    console.error("spriteId is missing in the action payload.");
                    return;
                }
            
                // Get the sprite by ID from the state
                const sprite = state.sprites[spriteId];
            
                // Log available sprite IDs for debugging
                console.log("Trying to find sprite with ID:", spriteId);
                console.log("Available sprite IDs:", Object.keys(state.sprites));
            
                // Check if the sprite exists
                if (!sprite) {
                    console.error(`Sprite with ID ${spriteId} not found.`);
                    return; // Exit if the sprite doesn't exist
                }
            
                // Check if times is a valid number
                if (!times || typeof times !== 'number' || times <= 0) {
                    console.error("Invalid 'times' value. Must be a positive number.");
                    return;
                }
            
                // Initialize actions if it doesn't exist
                sprite.actions = sprite.actions || []; // Ensure actions is an array
            
                // Repeat the action `times` and add each action to the sprite's actions array
                const repeatedActions = Array(times).fill({ actionType, payload });
            
                // Add the repeated actions to the sprite's existing actions
                sprite.actions = [...sprite.actions, ...repeatedActions];
            
                console.log(`Added ${times} actions of type ${actionType} to sprite ${spriteId}.`);
            }
            
            
            ,
        },
    });

    export const { repeatAction,addSprite, selectSprite, updateActionValue, toggleCollision, resetCollisionHandled, deleteAction, checkCollisionAndSwap, goTo, move, rotate, updateRepeatPayload, addActionToSprite, playAllSprites,resetSprites } = spritesSlice.actions;

    export default spritesSlice.reducer;
