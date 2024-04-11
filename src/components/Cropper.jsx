import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Range from './Range';
import EditArea from './EditArea';
import WheelController from './WheelController';
import { modifyCssLength } from '../utils/utils';
import ButtonsController from './ButtonsController';
// import '../styles/index.css';
import style from '../styles/cropper.css';

const defaultConfig = {
    shape: {
        borderRadius: '50%',
    },
    rangeControl: {
        color: 'grey',
    },
    wheelControl: {
        sensitivity: 5, // 1 to 10
    },
    buttonsControl: {
        step: 3,
    },
    targetImage: {
        type: 'image/png',
        quality: 1, // 0 to 1
        preserveOriginalScale: false,
    }
};


const Cropper = ({
    file,
    onSave,
    saveButton,
    box,
    shape,
    rangeControl,
    wheelControl,
    buttonsControl,
    targetImage,
}) => {
    const shapeRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const [zoom, setZoom] = useState(0);

    const config = useMemo(() => {
        const shapeDefaultSide = modifyCssLength(
            (parseFloat(box.width) > parseFloat(box.height)
                ? box.height
                : box.width),
            val => val * 0.9
        );
        return ({
            ...defaultConfig,
            box,
            shape: {
                ...defaultConfig.shape,
                height: shapeDefaultSide,
                width: shapeDefaultSide,
                ...((typeof shape === 'object') && shape)
            },
            rangeControl: (Boolean(rangeControl) && {
                ...defaultConfig.rangeControl,
                ...((typeof rangeControl === 'object') && rangeControl)
            }),
            wheelControl: (Boolean(wheelControl) && {
                ...defaultConfig.wheelControl,
                ...((typeof wheelControl === 'object') && wheelControl)
            }),
            buttonsControl: (Boolean(buttonsControl) && {
                ...defaultConfig.buttonsControl,
                ...((typeof buttonsControl === 'object') && buttonsControl)
            }),
            targetImage: {
                ...defaultConfig.targetImage,
                ...((typeof targetImage === 'object') && targetImage)
            }
        });
    }, [
        defaultConfig,
        box,
        shape,
        rangeControl,
        wheelControl,
        buttonsControl,
        targetImage,
    ]);


    // move this callback to hook?
    const cropArea = useCallback(() => {
        const imgRect = imgRef.current.getBoundingClientRect();
        const shapeRect = shapeRef.current.getBoundingClientRect();
        const scaleFactor = imgRef.current.naturalWidth / imgRect.width;

        const sx = (shapeRect.left - imgRect.left) * scaleFactor;
        const sy = (shapeRect.top - imgRect.top) * scaleFactor;
        const sWidth = shapeRect.width * scaleFactor;
        const sHeight = shapeRect.height * scaleFactor;

        const dWidth = config.targetImage.preserveOriginalScale ? sWidth : shapeRect.width;
        const dHeight = config.targetImage.preserveOriginalScale ? sHeight : shapeRect.height;

        canvasRef.current.setAttribute('width', `${dWidth}px`);
        canvasRef.current.setAttribute('height', `${dHeight}px`);
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(imgRef.current, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    }, [config]);

    const handleSave = useCallback(() => {
        cropArea();
        canvasRef.current.toBlob(
            blob => onSave(blob),
            config.targetImage.type,
            config.targetImage.quality
        );
    }, [cropArea, onSave, config]);

    useEffect(() => {
        if (!saveButton || !saveButton.current) {
            return;
        }
        saveButton.current.onclick = handleSave;
    }, [handleSave]);

    if (!file) {
        return null;
    }

    if (!onSave) {
        console.error("You must provide onSave callback");
        return null;
    }

    if (!saveButton) {
        console.error("You must provide saveButton prop");
        return null;
    }

    if (!box) {
        console.error("You must provide box prop");
        return null;
    }

    const element = (
        <div
            // ref={containerRef}
            className={style.cr_container}
            style={{ width: config.box.width }}
        >
            <EditArea
                file={file}
                imgRef={imgRef}
                shapeRef={shapeRef}
                zoom={zoom}
                styles={{
                    box: config.box,
                    shape: config.shape,
                }}
            />
            {Boolean(config.rangeControl) &&
                <Range
                    value={zoom}
                    setValue={setZoom}
                    options={config.rangeControl}
                />}
            {Boolean(config.wheelControl) &&
                <WheelController
                    setValue={setZoom}
                    options={config.wheelControl}
                />}
            {Boolean(config.buttonsControl) &&
                <ButtonsController
                    setValue={setZoom}
                    options={config.buttonsControl}
                />}
        </div>
    );

    return (
        <>
            {element}
            <canvas ref={canvasRef} hidden></canvas>
        </>
    );
};

export default Cropper;
