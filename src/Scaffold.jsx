import { useState, useRef, useEffect } from 'react';
import Cropper from './Cropper';


const Scaffold = () => {
    const fileInp = useRef(null);
    const targetImgRef = useRef(null);
    const [sourceFile, setSourceFile] = useState(null);
    const [targetFile, setTargetFile] = useState(null);


    useEffect(() => {
        if (targetFile) {
            console.log('targetFile >> ', targetFile);
            targetImgRef.current.src = URL.createObjectURL(targetFile);
        }
    }, [targetFile]);

    console.log('sourceFile >> ', sourceFile);
    return (
        <div className="user-wrapper">
            <h3>Your image</h3>
            <label htmlFor='user-btn'>Select an image</label>
            <input
                hidden
                type="file"
                accept="image/*"
                name="avatar"
                ref={fileInp}
                onChange={() => setSourceFile(fileInp.current.files[0])}
            />
            {/* user's own button with callback attached */}
            <button
                id='user-btn'
                onClick={() => fileInp.current.click()}
            >
                Select
            </button>

            <img
                ref={targetImgRef}
                height={200}
                width={200}
                style={{
                    borderRadius: '30%',
                    display: 'block',
                    marginTop: '20px'
                }}
            />

            <div className="user-wrapper-inner">

                <Cropper
                    file={sourceFile}
                    onSave={blob => setTargetFile(blob)}
                    // preserveOriginalScale
                    box={{
                        width: '45vw',
                        height: '35vw',
                    }}
                    shape={{
                        borderRadius: '30%',
                        height: '26vw',
                        width: '26vw',
                    }}
                    settings={{
                    }}
                />

            </div>
        </div>
    );
};

export default Scaffold;
