import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Range from './Range';
import useDrag from '../hooks/useDrag';
import { Displacement } from '../utils/utils';
import style from '../styles/cropper.css';
import usePinchZoom from '../hooks/usePinchZoom';

const EditArea = ({
    file,
    imgRef,
    shapeRef,
    zoom,
    setZoom,
    pinchZoomOptions,
    styles
}) => {
    const boxRef = useRef(null);

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
            if (imgInitialWidth >= boxWidth) {
                imgRef.current.style = `height: ${styles.shape.height}`;
            } else {
                imgRef.current.style = 'max-width: 100%';
            }
        } else {
            const { height: boxHeight } = boxRect.current;
            const imgInitialHeight = shapeSide * (naturalHeight / naturalWidth);

            if (imgInitialHeight >= boxHeight) {
                imgRef.current.style = `width: ${styles.shape.width}`;
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
        boxRef.current.style['opacity'] = '1';
    }, []);

    const updateImgPosition = useCallback((displacement, event) => {
        imgRef.current.style['transform'] = `translate(${displacement.x}px, ${displacement.y}px)`;
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

        const displacement = applyRestrictions(new Displacement(
            (imgTranslation.current.x / prevW) * scaledWidth,
            (imgTranslation.current.y / prevH) * scaledHeight,
        ));

        imgTranslation.current = displacement;

        updateImgPosition(displacement);
    }, []);

    const applyRestrictions = useCallback(displacement => {
        let adjustmentX = 0;
        let adjustmentY = 0;
        const {
            left: shapeLeft,
            width: shapeWidth,
            top: shapeTop,
            height: shapeHeight
        } = shapeRect.current;

        const imgLeft = imgRect.current.left + displacement.x - (parseFloat(imgRef.current.style['width']) - imgRect.current.width) / 2;
        const imgRight = imgLeft + parseFloat(imgRef.current.style['width']);

        const imgTop = imgRect.current.top + displacement.y - (parseFloat(imgRef.current.style['height']) - imgRect.current.height) / 2;
        const imgBottom = imgTop + parseFloat(imgRef.current.style['height']);

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
    }, []);

    const { handlePointerDown, handlePointerUp, handlePointerMove } = useDrag({
        pointerMoveCallback: updateImgPosition,
        applyRestrictions: applyRestrictions,
        refProp: imgTranslation,
    });

    const { onPointerDown, onPointerUp, onPointerMove } = usePinchZoom({
        handlePointerDown,
        handlePointerUp,
        handlePointerMove,
        setZoom,
        pinchZoomOptions
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
        imgRef.current.addEventListener('load', handleImgLoad);
        imgRef.current.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointercancel', onPointerUp);
        return () => {
            imgRef.current.removeEventListener('load', handleImgLoad);
            imgRef.current.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }, []);

    useEffect(() => {
        shapeRef.current.style.setProperty('--layer-radius', styles.shape.borderRadius);
        shapeRef.current.style.setProperty('--layer-dim', styles.layer.dim);
        shapeRef.current.style.setProperty('--layer-dim-transition', styles.layer.dimTransition);
    }, []);

    return (
        <div
            className={style.cr_edit_box}
            ref={boxRef}
            style={styles.box}
        >
            <img
                className={style.cr_img}
                ref={imgRef}
                draggable={false}
            />
            <div
                className={style.cr_shape}
                ref={shapeRef}
                style={styles.shape}
            >
            </div>
        </div>
    );
};

export default EditArea;
