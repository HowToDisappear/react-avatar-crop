import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Range from './Range';
import useDrag from './useDrag';
import { Displacement } from './common';


const EditArea = ({
    file,
    onSave,
    zoom = 1,
    box = {},
    shape = {
        borderRadius: '40%',
        height: '50%',
        width: '50%',
    },
}) => {
    const boxRef = useRef(null);
    const shapeRef = useRef(null);
    const imgRef = useRef(null);

    // Initial DOMRect of elements
    const boxRect = useRef(null);
    const shapeRect = useRef(null);
    const imgRect = useRef(null);

    const imgTranslation = useRef({ x: 0, y: 0 });

    const scaleFactor = useRef(null);

    const handleImgLoad = useCallback(() => {
        const { naturalWidth, naturalHeight } = imgRef.current;
        const { width: shapeSide } = shapeRect.current;

        if (naturalWidth > naturalHeight) {
            const { width: boxWidth } = boxRect.current;
            const imgInitialWidth = shapeSide / (naturalHeight / naturalWidth);
            // console.log('boxWidth >> ', boxWidth);
            if (imgInitialWidth >= boxWidth) {
                imgRef.current.style = `height: ${shape.height}`;
            } else {
                imgRef.current.style = 'max-width: 100%';
            }
        } else {
            const { height: boxHeight } = boxRect.current;
            const imgInitialHeight = shapeSide * (naturalHeight / naturalWidth);

            if (imgInitialHeight >= boxHeight) {
                imgRef.current.style = `width: ${shape.width}`;
            } else {
                imgRef.current.style = 'max-height: 100%';
            }
        }

        imgRect.current = imgRef.current.getBoundingClientRect();

        // temporary solution
        imgRef.current.style['width'] = `${imgRect.current.width}px`;
        imgRef.current.style['height'] = `${imgRect.current.height}px`;
        imgRef.current.style['maxWidth'] = 'unset';
        imgRef.current.style['maxHeight'] = 'unset';
    }, []);

    const updateImgSize = useCallback(() => {
        const { naturalWidth, naturalHeight } = imgRef.current;
        const { width, height } = imgRect.current;
        const scaledWidth = width + (naturalWidth - width) * scaleFactor.current;
        const scaledHeight = height + (naturalHeight - height) * scaleFactor.current;

        const prevW = parseFloat(imgRef.current.style['width']) || width;
        const prevH = parseFloat(imgRef.current.style['height']) || height;


        imgRef.current.style['width'] = `${scaledWidth}px`;
        imgRef.current.style['height'] = `${scaledHeight}px`;
        imgRef.current.style['maxWidth'] = 'unset';
        imgRef.current.style['maxHeight'] = 'unset';

        // console.log('prevW >>', prevW);

        const displacement = applyRestrictions(new Displacement(
            (imgTranslation.current.x / prevW) * scaledWidth,
            (imgTranslation.current.y / prevH) * scaledHeight,
        ));

        imgTranslation.current = displacement;

        updateImgPosition(displacement);

        // const { adjDeltaX, adjDeltaY } = applyRestrictions(
        //     (imgTranslation.current.x / prevW) * scaledWidth,
        //     (imgTranslation.current.y / prevH) * scaledHeight,
        //     0,
        //     0
        // );

        // imgTranslation.current = {
        //     x: adjDeltaX,
        //     y: adjDeltaY
        // };

        // updateImgPosition(
        //     imgTranslation.current.x,
        //     imgTranslation.current.y
        // );
    }, []);

    const updateImgPosition = useCallback((displacement, event) => {
        imgRef.current.style['transform'] = `translate(${displacement.x}px, ${displacement.y}px)`;
    }, []);

    const applyRestrictions = useCallback((displacement, deltaX, deltaY, accumX, accumY) => {
        // let adjDeltaX = deltaX;
        // let adjDeltaY = deltaY;
        let adjustmentX = 0;
        let adjustmentY = 0;
        // const displacementX = accumX + deltaX;
        // const displacementY = accumY + deltaY;
        const {
            left: shapeLeft,
            width: shapeWidth,
            top: shapeTop,
            height: shapeHeight
        } = shapeRect.current;

        // console.log('accumX >> ', accumX);
        // console.log('deltaX >> ', deltaX);
        // console.log('imgRect.current.left >> ', imgRect.current.left);

        const imgLeft = imgRect.current.left + displacement.x - (parseFloat(imgRef.current.style['width']) - imgRect.current.width) / 2;
        const imgRight = imgLeft + parseFloat(imgRef.current.style['width']);

        const imgTop = imgRect.current.top + displacement.y - (parseFloat(imgRef.current.style['height']) - imgRect.current.height) / 2;
        const imgBottom = imgTop + parseFloat(imgRef.current.style['height']);

        // console.log('imgLeft >> ', imgLeft);
        if (imgLeft > shapeLeft) {
            adjustmentX -= imgLeft - shapeLeft;
        } else if (imgRight < (shapeLeft + shapeWidth)) {
            adjustmentX -= imgRight - (shapeLeft + shapeWidth);
        }

        if (imgTop > shapeTop) {
            adjustmentY -= imgTop - shapeTop;
        } else if (imgBottom < (shapeTop + shapeHeight)) {
            adjustmentY -= imgBottom - (shapeTop + shapeHeight);
        }

        return new Displacement(displacement.x + adjustmentX, displacement.y + adjustmentY);
        // return { adjDeltaX, adjDeltaY };
    }, []);

    const { handlePointerDown, handlePointerUp, handlePointerMove } = useDrag({
        pointerMoveCallback: updateImgPosition,
        applyRestrictions: applyRestrictions,
        refProp: imgTranslation,
    });


    useEffect(() => {
        if (!imgRect.current) {
            return;
        }
        scaleFactor.current = zoom / 100;
        updateImgSize();
    }, [zoom]);

    useEffect(() => {
        imgRef.current.src = URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        boxRect.current = boxRef.current.getBoundingClientRect();
        shapeRect.current = shapeRef.current.getBoundingClientRect();
    }, []);

    useEffect(() => {
        // console.log('** mounting listeners **');
        imgRef.current.addEventListener('load', handleImgLoad);
        imgRef.current.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointermove', handlePointerMove);
        return () => {
            // console.log('** un-mounting listeners **');
            imgRef.current.removeEventListener('load', handleImgLoad);
            imgRef.current.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    return (
        <div
            className='cr-edit-box'
            ref={boxRef}
            style={box}
        >
            <img
                ref={imgRef}
                draggable={false}
                className='cr-img'
            />
            <div className='cr-shape' style={shape} ref={shapeRef}>
            </div>
        </div>
    );
};

export default EditArea;
