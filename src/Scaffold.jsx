import { useState, useRef, useEffect } from 'react';
import Cropper from './Cropper';
import { Dialog, DialogActions, DialogContent } from '@mui/material';


const Scaffold = () => {
    const fileInp = useRef(null);
    const targetImgRef = useRef(null);
    const saveBtnRef = useRef(null);
    const zoomInRef = useRef(null);
    const zoomOutRef = useRef(null);
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
            <button
                id='user-btn'
                onClick={() => fileInp.current.click()}
            >
                Select
            </button>

            <img
                ref={targetImgRef}
                style={{
                    // borderRadius: '30%',
                    display: 'block',
                    marginTop: '20px'
                }}
            />

            <div className="user-wrapper-inner">
                <Dialog
                    open={!!sourceFile}
                    // TransitionComponent={Transition}
                    keepMounted
                    // onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <Cropper
                            file={sourceFile}
                            onSave={blob => setTargetFile(blob)}
                            saveButton={saveBtnRef}
                            box={{
                                width: '500px',
                                height: '400px',
                            }}
                            shape={{
                                borderRadius: '30%',
                            }}
                            rangeControl={{
                                // color: 'green',
                                // width: '60%',
                            }}
                            wheelControl
                            // buttonsControl={{
                            //     zoomInControl: zoomInRef,
                            //     zoomOutControl: zoomOutRef,
                            // }}
                            // targetImage={{
                            //     preserveOriginalScale: true,
                            // }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button ref={saveBtnRef} type='button'>
                            Save!
                        </button>

                        <button ref={zoomInRef} type='button'>
                            +
                        </button>
                        <button ref={zoomOutRef} type='button'>
                            -
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default Scaffold;
