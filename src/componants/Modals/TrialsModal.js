// import React, { useState, useRef, useCallback, useEffect } from "react";
// import Webcam from "react-webcam";
// import styles from "./TrialsModal.module.css";
// import axios from 'axios';

// const TrialsModal = ({ visible, onClose, trials }) => {
//   const [trialInputs, setTrialInputs] = useState({});
//   const [showCamera, setShowCamera] = useState({});
//   const [sendStatus, setSendStatus] = useState({});
//   const [existingData, setExistingData] = useState({});
//   const webcamRefs = useRef({});

//   // Load existing data when modal opens
//   useEffect(() => {
//     if (visible && trials && trials.length > 0) {
//       loadExistingData();
//     }
//   }, [visible, trials]);

//   const loadExistingData = async () => {
//   try {
//     const promises = trials.map(async (trial, index) => {
//       // Debug logging to see what we're working with
//       console.log('Processing trial:', trial, 'at index:', index);
      
//       // Extract the test result ID with better fallback logic
//       let testResultId;
      
//       // Try different ID fields in order of preference
//       if (trial?.id) {
//         testResultId = String(trial.id);
//       } else if (trial?.test_result_id) {
//         testResultId = String(trial.test_result_id);
//       } else if (trial?.trial_number) {
//         testResultId = String(trial.trial_number);
//       } else {
//         // Fallback to index + 1 (assuming 1-based indexing)
//         testResultId = String(index + 1);
//       }
      
//       console.log(`Using test_result_id: ${testResultId} for trial at index ${index}`);
      
//       try {
//         const response = await axios.get(`http://localhost:8000/test-results/${testResultId}`);
//         console.log(`Successfully loaded data for trial ${testResultId}:`, response.data);
//         return { index, data: response.data, testResultId };
//       } catch (error) {
//         console.log(`No existing data for trial ${testResultId} (HTTP ${error.response?.status || 'Network Error'})`);
//         return { index, data: null, testResultId };
//       }
//     });

//     const results = await Promise.all(promises);
//     const existingDataMap = {};
    
//     results.forEach(({ index, data, testResultId }) => {
//       if (data) {
//         existingDataMap[index] = data;
        
//         // Pre-populate form if there's existing data
//         if (data.note || data.image_path) {
//           setTrialInputs(prev => ({
//             ...prev,
//             [index]: {
//               note: data.note || '',
//               image: null,
//               existingImagePath: data.image_path
//             }
//           }));
//         }
//       }
//     });
    
//     setExistingData(existingDataMap);
    
//   } catch (error) {
//     console.error('Error loading existing data:', error);
//   }
// };


//   // All hooks must be called before any conditional returns
//   const capturePhoto = useCallback((index) => {
//     const imageSrc = webcamRefs.current[index]?.getScreenshot();
//     if (imageSrc) {
//       fetch(imageSrc)
//         .then(res => res.blob())
//         .then(blob => {
//           const file = new File([blob], `trial-${index}-photo.jpg`, { type: 'image/jpeg' });
//           // Handle input change
//           setTrialInputs((prev) => ({
//             ...prev,
//             [index]: {
//               ...prev[index],
//               image: file,
//               existingImagePath: null // Clear existing image when new one is captured
//             },
//           }));
//           // Close camera
//           setShowCamera(prev => ({ ...prev, [index]: false }));
//         });
//     }
//   }, []);

//   // Early return AFTER all hooks
//   if (!visible) return null;

//   // Handle file and note changes
//   const handleInputChange = (index, field, value) => {
//     setTrialInputs((prev) => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         [field]: value,
//       },
//     }));
//   };

//   // Handle file input (for browse)
//   const handleFileChange = (index, event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setTrialInputs((prev) => ({
//         ...prev,
//         [index]: {
//           ...prev[index],
//           image: file,
//           existingImagePath: null // Clear existing image when new one is selected
//         },
//       }));
//     }
//   };

//   // Handle note input
//   const handleNoteChange = (index, event) => {
//     handleInputChange(index, "note", event.target.value);
//   };

//   // Open camera for specific trial
//   const handleOpenCamera = (index) => {
//     setShowCamera(prev => ({ ...prev, [index]: true }));
//   };

//   // Close camera for specific trial
//   const handleCloseCamera = (index) => {
//     setShowCamera(prev => ({ ...prev, [index]: false }));
//   };

//   const handleRemoveExistingImage = (index) => {
//     setTrialInputs(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         existingImagePath: null
//       }
//     }));
//   };

//   const handleSend = async (index, trial) => {
//     try {
//       const trialData = trialInputs[index];
      
//       if (!trialData || (!trialData.image && !trialData.note && !trialData.existingImagePath)) {
//         console.warn('No data to send for trial', index);
//         return;
//       }

//       // Set sending state
//       setSendStatus(prev => ({ ...prev, [index]: 'sending' }));

//       const formData = new FormData();
//       formData.append('note', trialData.note || '');
      
//       if (trialData.image) {
//         formData.append('image', trialData.image);
//       }

//       // Convert to string to match server expectations
//       const testResultId = String(trial?.id || trial?.test_result_id || trial?.trial_number || index);
      
//       console.log('Trial object:', trial);
//       console.log('Using test_result_id:', testResultId);

//       const response = await axios.put(`http://localhost:8000/test-results/${testResultId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Successfully sent trial data:', response.data);
      
//       // Set success state
//       setSendStatus(prev => ({ ...prev, [index]: 'success' }));
      
//       // Update existing image path if changed
//       if (response.data.result.image_path) {
//         setTrialInputs(prev => ({
//           ...prev,
//           [index]: {
//             ...prev[index],
//             existingImagePath: response.data.result.image_path,
//             image: null // Clear the new image after successful upload
//           }
//         }));
//       }
      
//       // Clear success status after 2 seconds
//       setTimeout(() => {
//         setSendStatus(prev => ({ ...prev, [index]: null }));
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error sending trial data:', error);
      
//       // Set error state
//       setSendStatus(prev => ({ ...prev, [index]: 'error' }));
      
//       // Clear error status after 2 seconds
//       setTimeout(() => {
//         setSendStatus(prev => ({ ...prev, [index]: null }));
//       }, 2000);
      
//       if (error.response) {
//         console.error('Server error:', error.response.data);
//       } else if (error.request) {
//         console.error('Network error:', error.request);
//       } else {
//         console.error('Error:', error.message);
//       }
//     }
//   };

//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "environment" // Use back camera on mobile
//   };

//   return (
//     <div className={styles.modalBackdrop}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <h3>Trials Overview</h3>
//           <button className={styles.closeButton} onClick={onClose}>
//             &times;
//           </button>
//         </div>

//         {trials.length === 0 ? (
//           <p>No trials available.</p>
//         ) : (
//           trials.map((trial, index) => (
//             <div key={index} className={styles.trialSection}>
//               <h5>Trial #{trial.trial_number}</h5>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     <th>Gauge</th>
//                     <th>Max</th>
//                     <th>Permanent</th>
//                     <th>Recovery</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {trial.deflections.map((d, idx) => (
//                     <tr key={idx}>
//                       <td>{d.deflection_gauge}</td>
//                       <td>{d.max_deflection}</td>
//                       <td>{d.permanent_deflection}</td>
//                       <td>{d.recovery}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
              
//               <div className={styles.trialInputs}>
//                 {/* Browse Button */}
//                 <label className={styles.browseLabel}>
//                   Browse
//                   <input
//                     type="file"
//                     accept="image/*"
//                     style={{ display: "none" }}
//                     onChange={(e) => handleFileChange(index, e)}
//                   />
//                 </label>

//                 {/* Capture from Camera Button */}
//                 <button
//                   type="button"
//                   className={styles.cameraButton}
//                   onClick={() => handleOpenCamera(index)}
//                 >
//                   Capture from Camera
//                 </button>

//                 {/* Camera Modal */}
//                 {showCamera[index] && (
//                   <div className={styles.cameraModal}>
//                     <div className={styles.cameraContainer}>
//                       <Webcam
//                         audio={false}
//                         ref={el => webcamRefs.current[index] = el}
//                         screenshotFormat="image/jpeg"
//                         videoConstraints={videoConstraints}
//                         className={styles.webcam}
//                       />
//                       <div className={styles.cameraControls}>
//                         <button
//                           className={styles.captureButton}
//                           onClick={() => capturePhoto(index)}
//                         >
//                           Capture
//                         </button>
//                         <button
//                           className={styles.cancelButton}
//                           onClick={() => handleCloseCamera(index)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Image preview - show new image or existing image */}
//                 {trialInputs[index]?.image && (
//                   <img
//                     src={URL.createObjectURL(trialInputs[index].image)}
//                     alt="Preview"
//                     className={styles.imagePreview}
//                   />
//                 )}
//                 {!trialInputs[index]?.image && trialInputs[index]?.existingImagePath && (
//                   <div className={styles.existingImageContainer}>
//                     <img
//                       src={`http://localhost:8000/${trialInputs[index].existingImagePath}`}
//                       alt="Existing image"
//                       className={styles.imagePreview}
//                     />
//                     <button
//                       className={styles.removeImageButton}
//                       onClick={() => handleRemoveExistingImage(index)}
//                       title="Remove existing image"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 )}

//                 <textarea
//                   placeholder="Write a note..."
//                   value={trialInputs[index]?.note || ""}
//                   onChange={(e) => handleNoteChange(index, e)}
//                   className={styles.noteInput}
//                 />

//                 {/* Send Button Container with Check Icon */}
//                 <div className={styles.sendButtonContainer}>
//                   <button
//                     className={styles.sendButton}
//                     onClick={() => handleSend(index, trial)}
//                     disabled={sendStatus[index] === 'sending' || (!trialInputs[index]?.image && !trialInputs[index]?.note && !trialInputs[index]?.existingImagePath)}
//                   >
//                     {sendStatus[index] === 'sending' ? 'Sending...' : 'Send'}
//                   </button>
                  
//                   {/* Check Icon */}
//                   {sendStatus[index] === 'success' && (
//                     <div className={styles.checkIcon}>
//                       ✓
//                     </div>
//                   )}
                  
//                   {/* Error Icon */}
//                   {sendStatus[index] === 'error' && (
//                     <div className={styles.errorIcon}>
//                       ✗
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrialsModal;

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./TrialsModal.module.css";
import axios from 'axios';
import ImageModal from './ImageModal'; // Add this import

const TrialsModal = ({ visible, onClose, trials }) => {
  const [trialInputs, setTrialInputs] = useState({});
  const [showCamera, setShowCamera] = useState({});
  const [sendStatus, setSendStatus] = useState({});
  const [existingData, setExistingData] = useState({});
  // Add these new states for image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [selectedImageAlt, setSelectedImageAlt] = useState('');
  const webcamRefs = useRef({});

  // Load existing data when modal opens
  useEffect(() => {
    if (visible && trials && trials.length > 0) {
      loadExistingData();
    }
  }, [visible, trials]);

  const loadExistingData = async () => {
    try {
      const promises = trials.map(async (trial, index) => {
        // Debug logging to see what we're working with
        console.log('Processing trial:', trial, 'at index:', index);
        
        // Extract the test result ID with better fallback logic
        let testResultId;
        
        // Try different ID fields in order of preference
        if (trial?.id) {
          testResultId = String(trial.id);
        } else if (trial?.test_result_id) {
          testResultId = String(trial.test_result_id);
        } else if (trial?.trial_number) {
          testResultId = String(trial.trial_number);
        } else {
          // Fallback to index + 1 (assuming 1-based indexing)
          testResultId = String(index + 1);
        }
        
        console.log(`Using test_result_id: ${testResultId} for trial at index ${index}`);
        
        try {
          const response = await axios.get(`http://localhost:8000/test-results/${testResultId}`);
          console.log(`Successfully loaded data for trial ${testResultId}:`, response.data);
          return { index, data: response.data, testResultId };
        } catch (error) {
          console.log(`No existing data for trial ${testResultId} (HTTP ${error.response?.status || 'Network Error'})`);
          return { index, data: null, testResultId };
        }
      });

      const results = await Promise.all(promises);
      const existingDataMap = {};
      
      results.forEach(({ index, data, testResultId }) => {
        if (data) {
          existingDataMap[index] = data;
          
          // Pre-populate form if there's existing data
          if (data.note || data.image_path) {
            setTrialInputs(prev => ({
              ...prev,
              [index]: {
                note: data.note || '',
                image: null,
                existingImagePath: data.image_path
              }
            }));
          }
        }
      });
      
      setExistingData(existingDataMap);
      
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  // All hooks must be called before any conditional returns
  const capturePhoto = useCallback((index) => {
    const imageSrc = webcamRefs.current[index]?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `trial-${index}-photo.jpg`, { type: 'image/jpeg' });
          // Handle input change
          setTrialInputs((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              image: file,
              existingImagePath: null // Clear existing image when new one is captured
            },
          }));
          // Close camera
          setShowCamera(prev => ({ ...prev, [index]: false }));
        });
    }
  }, []);

  // Early return AFTER all hooks
  if (!visible) return null;

  // Add these new functions for image modal
  const handleImageClick = (imageSrc, altText) => {
    setSelectedImageSrc(imageSrc);
    setSelectedImageAlt(altText);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImageSrc('');
    setSelectedImageAlt('');
  };

  // Handle file and note changes
  const handleInputChange = (index, field, value) => {
    setTrialInputs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // Handle file input (for browse)
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setTrialInputs((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          image: file,
          existingImagePath: null // Clear existing image when new one is selected
        },
      }));
    }
  };

  // Handle note input
  const handleNoteChange = (index, event) => {
    handleInputChange(index, "note", event.target.value);
  };

  // Open camera for specific trial
  const handleOpenCamera = (index) => {
    setShowCamera(prev => ({ ...prev, [index]: true }));
  };

  // Close camera for specific trial
  const handleCloseCamera = (index) => {
    setShowCamera(prev => ({ ...prev, [index]: false }));
  };

  const handleRemoveExistingImage = (index) => {
    setTrialInputs(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        existingImagePath: null
      }
    }));
  };

  const handleSend = async (index, trial) => {
    try {
      const trialData = trialInputs[index];
      
      if (!trialData || (!trialData.image && !trialData.note && !trialData.existingImagePath)) {
        console.warn('No data to send for trial', index);
        return;
      }

      // Set sending state
      setSendStatus(prev => ({ ...prev, [index]: 'sending' }));

      const formData = new FormData();
      formData.append('note', trialData.note || '');
      
      if (trialData.image) {
        formData.append('image', trialData.image);
      }

      // Convert to string to match server expectations
      const testResultId = String(trial?.id || trial?.test_result_id || trial?.trial_number || index);
      
      console.log('Trial object:', trial);
      console.log('Using test_result_id:', testResultId);

      const response = await axios.put(`http://localhost:8000/test-results/${testResultId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Successfully sent trial data:', response.data);
      
      // Set success state
      setSendStatus(prev => ({ ...prev, [index]: 'success' }));
      
      // Update existing image path if changed
      if (response.data.result.image_path) {
        setTrialInputs(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            existingImagePath: response.data.result.image_path,
            image: null // Clear the new image after successful upload
          }
        }));
      }
      
      // Clear success status after 2 seconds
      setTimeout(() => {
        setSendStatus(prev => ({ ...prev, [index]: null }));
      }, 2000);
      
    } catch (error) {
      console.error('Error sending trial data:', error);
      
      // Set error state
      setSendStatus(prev => ({ ...prev, [index]: 'error' }));
      
      // Clear error status after 2 seconds
      setTimeout(() => {
        setSendStatus(prev => ({ ...prev, [index]: null }));
      }, 2000);
      
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('Network error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use back camera on mobile
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Trials Overview</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {trials.length === 0 ? (
          <p>No trials available.</p>
        ) : (
          trials.map((trial, index) => (
            <div key={index} className={styles.trialSection}>
              <h5>Trial #{trial.trial_number}</h5>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Gauge</th>
                    <th>Max</th>
                    <th>Permanent</th>
                    <th>Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  {trial.deflections.map((d, idx) => (
                    <tr key={idx}>
                      <td>{d.deflection_gauge}</td>
                      <td>{d.max_deflection}</td>
                      <td>{d.permanent_deflection}</td>
                      <td>{d.recovery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className={styles.trialInputs}>
                {/* Browse Button */}
                <label className={styles.browseLabel}>
                  Browse
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(index, e)}
                  />
                </label>

                {/* Capture from Camera Button */}
                <button
                  type="button"
                  className={styles.cameraButton}
                  onClick={() => handleOpenCamera(index)}
                >
                  Capture from Camera
                </button>

                {/* Camera Modal */}
                {showCamera[index] && (
                  <div className={styles.cameraModal}>
                    <div className={styles.cameraContainer}>
                      <Webcam
                        audio={false}
                        ref={el => webcamRefs.current[index] = el}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className={styles.webcam}
                      />
                      <div className={styles.cameraControls}>
                        <button
                          className={styles.captureButton}
                          onClick={() => capturePhoto(index)}
                        >
                          Capture
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleCloseCamera(index)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image preview - show new image or existing image with click handlers */}
                {trialInputs[index]?.image && (
                  <img
                    src={URL.createObjectURL(trialInputs[index].image)}
                    alt={`Trial ${trial.trial_number} preview`}
                    className={`${styles.imagePreview} ${styles.clickableImage}`}
                    onClick={() => handleImageClick(
                      URL.createObjectURL(trialInputs[index].image),
                      `Trial ${trial.trial_number} preview`
                    )}
                  />
                )}
                {!trialInputs[index]?.image && trialInputs[index]?.existingImagePath && (
                  <div className={styles.existingImageContainer}>
                    <img
                      src={`http://localhost:8000/${trialInputs[index].existingImagePath}`}
                      alt={`Trial ${trial.trial_number} existing img`}
                      className={`${styles.imagePreview} ${styles.clickableImage}`}
                      onClick={() => handleImageClick(
                        `http://localhost:8000/${trialInputs[index].existingImagePath}`,
                        `Trial ${trial.trial_number} existing img`
                      )}
                    />
                    <button
                      className={styles.removeImageButton}
                      onClick={() => handleRemoveExistingImage(index)}
                      title="Remove existing image"
                    >
                      ×
                    </button>
                  </div>
                )}

                <textarea
                  placeholder="Write a note..."
                  value={trialInputs[index]?.note || ""}
                  onChange={(e) => handleNoteChange(index, e)}
                  className={styles.noteInput}
                />

                {/* Send Button Container with Check Icon */}
                <div className={styles.sendButtonContainer}>
                  <button
                    className={styles.sendButton}
                    onClick={() => handleSend(index, trial)}
                    disabled={sendStatus[index] === 'sending' || (!trialInputs[index]?.image && !trialInputs[index]?.note && !trialInputs[index]?.existingImagePath)}
                  >
                    {sendStatus[index] === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                  
                  {/* Check Icon */}
                  {sendStatus[index] === 'success' && (
                    <div className={styles.checkIcon}>
                      ✓
                    </div>
                  )}
                  
                  {/* Error Icon */}
                  {sendStatus[index] === 'error' && (
                    <div className={styles.errorIcon}>
                      ✗
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Add the ImageModal component */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageModal}
        imageSrc={selectedImageSrc}
        altText={selectedImageAlt}
      />
    </div>
  );
};

export default TrialsModal;
