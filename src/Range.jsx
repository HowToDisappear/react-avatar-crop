import { useState, useRef, useEffect, useCallback } from 'react';
import useDrag from './useDrag';


const Range = ({ value, setValue, zoom = 1 }) => {
    const rangeRef = useRef(null);
    const rangeRect = useRef(null);

    const pointerMoveCallback = useCallback((deltaX, deltaY) => {
        setValue(((deltaX - rangeRect.current.left) / rangeRect.current.width) * 100);
    }, []);

    const pointerDownCallback = useCallback((initX, initY, accumDisplacement) => {
        accumDisplacement.current.x = initX;
        setValue(((initX - rangeRect.current.left) / rangeRect.current.width) * 100);
    }, []);

    const applyRestrictions = useCallback((deltaX, deltaY, accumX, accumY) => {
        let adjDeltaX = deltaX;
        const displacementX = accumX + deltaX;
        const { left: shapeLeft, width: shapeWidth } = rangeRect.current;

        // const imgLeft = imgRect.current.left + displacementX;
        // const imgRight = imgLeft + imgRect.current.width * zoom;

        // const thumbPos = shapeLeft + shapeWidth * (value / 100) + displacementX;


        // if (thumbPos < shapeLeft) {
        //     adjDeltaX -= thumbPos - shapeLeft;
        // } else if (thumbPos > (shapeLeft + shapeWidth)) {
        //     adjDeltaX -= thumbPos - (shapeLeft + shapeWidth);
        // }
        if (displacementX < shapeLeft) {
            adjDeltaX -= displacementX - shapeLeft;
        } else if (displacementX > (shapeLeft + shapeWidth)) {
            adjDeltaX -= displacementX - (shapeLeft + shapeWidth);
        }

        return { adjDeltaX };
    }, []);

    const { handlePointerDown, handlePointerUp, handlePointerMove } = useDrag({
        pointerMoveCallback,
        applyRestrictions: applyRestrictions,
        pointerDownCallback,
    });

    useEffect(() => {
        rangeRect.current = rangeRef.current.getBoundingClientRect();
    }, []);

    useEffect(() => {
        // console.log('** mounting listeners **');
        rangeRef.current.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointermove', handlePointerMove);
        return () => {
            // console.log('** un-mounting listeners **');
            rangeRef.current.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    return (
        <span
            className='cr-range-box'
            ref={rangeRef}
            // onClick={evt => {
            //     const { left, width } = rangeRef.current.getBoundingClientRect();
            //     // console.log(evt);
            //     let progr = Math.max(evt.clientX - left, 0) / width;
            //     progr = Math.round(progr * 100);
            //     console.log('progr >> ', progr);
            //     setValue(progr);
            // }}
        >
            <span className='cr-range-track'></span>
            <span className='cr-range-progress' style={{ width: `${value}%` }}></span>
            <span className='cr-range-thumb'></span>
            <input className='' type='range' hidden value={value} />
        </span>
    );
};

export default Range;
