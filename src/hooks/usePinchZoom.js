import { useCallback, useRef } from "react";

const usePinchZoom = ({
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    setZoom,
    pinchZoomOptions
}) => {
    const touches = useRef([]);
    const prevDistance = useRef(null);

    const onPointerDown = useCallback(evt => {
        evt.preventDefault();
        if (touches.current.length >= 2) {
            return;
        }
        touches.current.push(evt);
        if (touches.current.length === 1) {
            handlePointerDown(touches.current[0])
        } else if (touches.current.length === 2) {
            handlePointerUp(touches.current[0]);
        }
    }, [handlePointerDown, handlePointerUp]);

    const onPointerMove = useCallback(evt => {
        evt.preventDefault();
        const ind = touches.current.findIndex(item => item.pointerId === evt.pointerId);
        touches.current[ind] = evt;
        if (touches.current.length === 1) {
            handlePointerMove(evt);
        } else if (touches.current.length === 2) {
            const distance = Math.hypot(
                touches.current[1].clientX - touches.current[0].clientX,
                touches.current[1].clientY - touches.current[0].clientY
            );
            if (!prevDistance.current) {
                prevDistance.current = distance;
                return;
            }
            const change = distance - prevDistance.current;
            setZoom(value => (
                Math.min(Math.max(value + change * pinchZoomOptions.sensitivity / 10, 0), 100)
            ));
            prevDistance.current = distance;
        }
    }, [handlePointerMove, setZoom]);

    const onPointerUp = useCallback(evt => {
        evt.preventDefault();
        if (touches.current.length > 2) {
            return;
        }
        handlePointerUp(evt);
        const ind = touches.current.findIndex(item => item.pointerId === evt.pointerId);
        touches.current.splice(ind, 1);
        prevDistance.current = null;
    }, [handlePointerDown, handlePointerUp]);

    return { onPointerDown, onPointerUp, onPointerMove };
};

export default usePinchZoom;
