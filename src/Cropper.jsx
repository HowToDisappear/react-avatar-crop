import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Range from './Range';
import EditArea from './EditArea';
import WheelController from './WheelController';

const defaultConfig = {
    wheelController: true,
    wheelControllerOptions: {
        sensitivity: 5, // 1 to 10
        min: 0,
        max: 100,
    },
    targetImageOptions: {
        type: 'image/png',
        quality: 1, // 0 to 1
    }
};


const Cropper = ({
    file,
    onSave,
    box = {},
    shape = {
        borderRadius: '40%',
        height: '50%',
        width: '50%',
    },
    preserveOriginalScale,
    settings = {},
}) => {
    const shapeRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    // const canvasContext = useRef(null);
    const [zoom, setZoom] = useState(0);

    const config = useMemo(() => ({
        ...defaultConfig,
        ...settings,
        wheelControllerOptions: {
            ...defaultConfig.wheelControllerOptions,
            ...(settings.wheelControllerOptions ?? {})
        },
        targetImageOptions: {
            ...defaultConfig.targetImageOptions,
            ...(settings.targetImageOptions ?? {})
        }
    }), [defaultConfig, settings]);

    const cropArea = useCallback(() => {
        const imgRect = imgRef.current.getBoundingClientRect();
        const shapeRect = shapeRef.current.getBoundingClientRect();
        const scaleFactor = imgRef.current.naturalWidth / imgRect.width;

        const sx = (shapeRect.left - imgRect.left) * scaleFactor;
        const sy = (shapeRect.top - imgRect.top) * scaleFactor;
        const sWidth = shapeRect.width * scaleFactor;
        const sHeight = shapeRect.height * scaleFactor;

        const dWidth = preserveOriginalScale ? sWidth : shapeRect.width;
        const dHeight = preserveOriginalScale ? sHeight : shapeRect.height;

        canvasRef.current.setAttribute('width', `${dWidth}px`);
        canvasRef.current.setAttribute('height', `${dHeight}px`);
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(imgRef.current, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    }, [preserveOriginalScale]);

    const handleSave = useCallback(() => {
        cropArea();
        canvasRef.current.toBlob(
            blob => onSave(blob),
            config.targetImageOptions.type,
            config.targetImageOptions.quality
        );
    }, [cropArea, onSave]);

    if (!file) {
        return null;
    }

    const element = (
        <div className='cr-layer'>
            <div className='cr-edit-layer'>
                <div
                    // ref={containerRef}
                    className='cr-container'
                    style={{ width: box.width }}
                >
                    <EditArea
                        file={file}
                        imgRef={imgRef}
                        shapeRef={shapeRef}
                        zoom={zoom}
                        styles={{
                            box,
                            shape,
                        }}
                    />
                    <Range value={zoom} setValue={setZoom} />
                    {config.wheelController &&
                        <WheelController
                            setValue={setZoom}
                            options={config.wheelControllerOptions}
                        />}
                    <button
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );

    // console.log('render -- ', preserveOriginalSize);
    return (
        <>
            {createPortal(element, document.body)}
            <canvas ref={canvasRef} hidden></canvas>
        </>
    );
};

export default Cropper;
