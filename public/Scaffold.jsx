import { useState, useRef, useEffect } from 'react';
import { Cropper } from '../src';

const Scaffold = () => {
    const [sourceFile, setSourceFile] = useState(null);
    const [targetFile, setTargetFile] = useState(null);
    const saveBtnRef = useRef(null);
    const targetImgRef = useRef(null);

    useEffect(() => {
        if (targetFile) {
            targetImgRef.current.src = URL.createObjectURL(targetFile);
        }
    }, [targetFile]);

    return (
        <div>
            <h3>Your avatar</h3>
            <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={evt => setSourceFile(evt.target.files[0])}
            />
            {Boolean(sourceFile) &&
                <>
                    <Cropper
                        file={sourceFile}
                        onSave={blob => setTargetFile(blob)}
                        saveButton={saveBtnRef}
                        box={{
                            width: '500px',
                            height: '400px',
                        }}
                        wheelControl
                        rangeControl
                    />
                    <button ref={saveBtnRef}>Save</button>
                </>
            }
            <img
                ref={targetImgRef}
                style={{
                    borderRadius: '50%',
                    display: 'block',
                }}
            />
        </div>
    );
};

export default Scaffold;
