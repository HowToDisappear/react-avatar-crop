import { useRef, useCallback } from 'react';
import { Displacement } from '../utils/utils';


const useDrag = ({
    pointerDownCallback,
    pointerMoveCallback,
    applyRestrictions,
    refProp,
    options = {},
}) => {
    const initPos = useRef(null);
    const isDragged = useRef(false);
    const accumDisplacement = refProp ?? useRef(new Displacement(0, 0));


    const handlePointerDown = useCallback(evt => {
        initPos.current = { x: evt.clientX, y: evt.clientY };
        if (options.updateOnPointerDown) {
            accumDisplacement.current = new Displacement(initPos.current.x, initPos.current.y);
        }
        if (typeof pointerDownCallback === 'function') {
            pointerDownCallback(accumDisplacement.current, evt);
        }
        isDragged.current = true;
    }, []);

    const handlePointerUp = useCallback(evt => {
        if (!isDragged.current) {
            return;
        }
        const deltaX = evt.clientX - initPos.current.x;
        const deltaY = evt.clientY - initPos.current.y;
        const displacement = applyRestrictions(new Displacement(
            accumDisplacement.current.x + deltaX,
            accumDisplacement.current.y + deltaY,
        ));

        accumDisplacement.current = displacement;
        isDragged.current = false;
    }, []);

    const handlePointerMove = useCallback(evt => {
        if (!isDragged.current) {
            return;
        }
        const deltaX = evt.clientX - initPos.current.x;
        const deltaY = evt.clientY - initPos.current.y;
        const displacement = applyRestrictions(new Displacement(
            accumDisplacement.current.x + deltaX,
            accumDisplacement.current.y + deltaY,
        ));

        pointerMoveCallback(displacement, evt);
    }, [pointerMoveCallback]);

    return { handlePointerDown, handlePointerUp, handlePointerMove };
};

export default useDrag;
