import { useRef, useCallback } from 'react';


const useDrag = ({
    pointerDownCallback,
    pointerMoveCallback,
    applyRestrictions,
    refProp
}) => {
    const initPos = useRef(null);
    const isDragged = useRef(false);
    const accumDisplacement = refProp ?? useRef({ x: 0, y: 0 });
    const deltaDisplacement = useRef({ x: 0, y: 0 });


    const handlePointerDown = useCallback(evt => {
        // console.log('DOWN');
        if (typeof pointerDownCallback === 'function') {
            pointerDownCallback(evt.clientX, evt.clientY, accumDisplacement);
        }
        initPos.current = { x: evt.clientX, y: evt.clientY };
        isDragged.current = true;
    }, []);

    const handlePointerUp = useCallback(evt => {
        if (!isDragged.current) {
            return;
        }
        // console.log('UP');
        isDragged.current = false;
        accumDisplacement.current = {
            x: accumDisplacement.current.x + deltaDisplacement.current.x,
            y: accumDisplacement.current.y + deltaDisplacement.current.y
        };
    }, []);

    const handlePointerMove = useCallback(evt => {
        if (!isDragged.current) {
            return;
        }
        const deltaX = evt.clientX - initPos.current.x;
        const deltaY = evt.clientY - initPos.current.y;

        const { adjDeltaX, adjDeltaY } = applyRestrictions(
            deltaX,
            deltaY,
            accumDisplacement.current.x,
            accumDisplacement.current.y
        );

        deltaDisplacement.current = {
            x: adjDeltaX,
            y: adjDeltaY
        };

        // deltaDisplacement.current = {
        //     x: deltaX,
        //     y: deltaY
        // };

        pointerMoveCallback(
            accumDisplacement.current.x + deltaDisplacement.current.x,
            accumDisplacement.current.y + deltaDisplacement.current.y
        );
    }, [pointerMoveCallback]);

    return { handlePointerDown, handlePointerUp, handlePointerMove };
};

export default useDrag;
