import { useState, useRef, useEffect, useCallback } from 'react';
import useDrag from '../hooks/useDrag';
import { Displacement } from '../utils/utils';


const Range = ({ value, setValue, options }) => {
    const rangeRef = useRef(null);
    const rangeRect = useRef(null);

    const updateValue = useCallback((displacement, event) => {
        setValue(((displacement.x - rangeRect.current.left) / rangeRect.current.width) * 100);
    }, []);

    const applyRestrictions = useCallback(displacement => {
        let adjustmentX = 0;
        const { left: shapeLeft, width: shapeWidth } = rangeRect.current;

        if (displacement.x < shapeLeft) {
            adjustmentX -= displacement.x - shapeLeft;
        } else if (displacement.x > (shapeLeft + shapeWidth)) {
            adjustmentX -= displacement.x - (shapeLeft + shapeWidth);
        }

        return new Displacement(displacement.x + adjustmentX, 0);
    }, []);

    const { handlePointerDown, handlePointerUp, handlePointerMove } = useDrag({
        pointerDownCallback: updateValue,
        pointerMoveCallback: updateValue,
        applyRestrictions: applyRestrictions,
        options: {
            updateOnPointerDown: true,
        }
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
            ref={rangeRef}
            className='cr-range-box'
            style={{
                color: options.color,
            }}
        >
            <span className='cr-range-track'></span>
            <span className='cr-range-progress' style={{ width: `${value}%` }}></span>
            <span className='cr-range-thumb' style={{ left: `${value}%` }}></span>
            <input className='' type='range' hidden value={value} readOnly />
        </span>
    );
};

export default Range;
