// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Webcam from "react-webcam";
// import axios from 'axios';
// import styles from "./TrialsPage.module.css";

// export default function TrialsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { projectName, testId } = useParams();

//   const { trialsData, testInfo, deviceName } = location.state || {};

//   // Photo capture states
//   const [trialInputs, setTrialInputs] = useState({});
//   const [showCamera, setShowCamera] = useState({});
//   const [sendStatus, setSendStatus] = useState({});
//   const [existingData, setExistingData] = useState({});
//   const webcamRefs = useRef({});

//   // Load existing data when component mounts
//   useEffect(() => {
//     if (trialsData && trialsData.length > 0) {
//       loadExistingData();
//     }
//   }, [trialsData]);

//   const loadExistingData = async () => {
//     try {
//       const promises = trialsData.map(async (trial, index) => {
//         const testResultId = String(trial?.id || trial?.test_result_id || trial?.trial_number || index);
        
//         try {
//           const response = await axios.get(`http://localhost:8000/test-results/${testResultId}`);
//           return { index, data: response.data };
//         } catch (error) {
//           console.log(`No existing data for trial ${testResultId}`);
//           return { index, data: null };
//         }
//       });

//       const results = await Promise.all(promises);
//       const existingDataMap = {};
      
//       results.forEach(({ index, data }) => {
//         if (data) {
//           existingDataMap[index] = data;
          
//           // Pre-populate form if there's existing data
//           if (data.note || data.image_path) {
//             setTrialInputs(prev => ({
//               ...prev,
//               [index]: {
//                 note: data.note || '',
//                 image: null, // Will be handled separately for existing images
//                 existingImagePath: data.image_path
//               }
//             }));
//           }
//         }
//       });
      
//       setExistingData(existingDataMap);
      
//     } catch (error) {
//       console.error('Error loading existing data:', error);
//     }
//   };

//   // Photo capture callback - must be before early return
//   const capturePhoto = useCallback((index) => {
//     const imageSrc = webcamRefs.current[index]?.getScreenshot();
//     if (imageSrc) {
//       fetch(imageSrc)
//         .then(res => res.blob())
//         .then(blob => {
//           const file = new File([blob], `trial-${index}-photo.jpg`, { type: 'image/jpeg' });
//           setTrialInputs((prev) => ({
//             ...prev,
//             [index]: {
//               ...prev[index],
//               image: file,
//               existingImagePath: null // Clear existing image when new one is captured
//             },
//           }));
//           setShowCamera(prev => ({ ...prev, [index]: false }));
//         });
//     }
//   }, []);

//   // Handle trial click to navigate to deflections page
//   const handleTrialClick = (trial) => {
//     navigate(
//       `/projects/${encodeURIComponent(projectName)}/tests/${testId}/trials/${
//         trial.id
//       }/deflections`,
//       {
//         state: {
//           deflectionsData: trial.deflections,
//           trialInfo: trial,
//           testInfo,
//           projectName,
//           deviceName,
//         },
//       }
//     );
//   };

//   // Photo capture functions
//   const handleInputChange = (index, field, value) => {
//     setTrialInputs((prev) => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         [field]: value,
//       },
//     }));
//   };

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

//   const handleNoteChange = (index, event) => {
//     handleInputChange(index, "note", event.target.value);
//   };

//   const handleOpenCamera = (index) => {
//     setShowCamera(prev => ({ ...prev, [index]: true }));
//   };

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

//   // Updated handleSend with same logic as TrialsModal
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

//   // Prevent row click when interacting with photo controls
//   const handlePhotoControlClick = (event) => {
//     event.stopPropagation();
//   };

//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "environment"
//   };

//   if (!trialsData || trialsData.length === 0) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.breadcrumb}>
//           <button
//             onClick={() => navigate("/display")}
//             className={styles.breadcrumbLink}
//           >
//             Projects
//           </button>
//           <span> / </span>
//           <button
//             onClick={() =>
//               navigate(`/projects/${encodeURIComponent(projectName)}/tests`, {
//                 state: { projectName, deviceName },
//               })
//             }
//             className={styles.breadcrumbLink}
//           >
//             {projectName}
//           </button>
//           <span> / Test {testId}</span>
//         </div>

//         <h2 className={styles.heading}>Trials for Test {testId}</h2>
//         <p>No trials data available for this test.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <button className={styles.button} onClick={() => navigate(-1)}>Back</button>

//       <h2 className={styles.heading}>Trials for Test {testId}</h2>
      
//       {/* Trials Table */}
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Trial ID</th>
//               <th>Trial Number</th>
//               <th>Num of Deflections</th>
//               <th>Photo & Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {trialsData.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className={styles.noData}>
//                   No trials found
//                 </td>
//               </tr>
//             ) : (
//               trialsData.map((trial, index) => {
//                 const hasDeflections =
//                   trial.deflections && trial.deflections.length > 0;
//                 const deflectionCount = trial.deflections
//                   ? trial.deflections.length
//                   : 0;

//                 return (
//                   <tr
//                     key={index}
//                     onClick={
//                       hasDeflections ? () => handleTrialClick(trial) : undefined
//                     }
//                     style={{
//                       cursor: hasDeflections ? "pointer" : "default",
//                       opacity: hasDeflections ? 1 : 0.6,
//                     }}
//                     className={
//                       hasDeflections ? styles.clickableRow : styles.disabledRow
//                     }
//                   >
//                     <td>
//                       <strong className={styles.trialId}>{trial.id}</strong>
//                     </td>
//                     <td>{trial.trial_number}</td>
//                     <td>
//                       <span
//                         className={
//                           deflectionCount > 0
//                             ? styles.deflectionCount
//                             : styles.noDeflections
//                         }
//                       >
//                         {deflectionCount}
//                       </span>
//                     </td>
//                     <td onClick={handlePhotoControlClick}>
//                       <div className={styles.photoControls}>
//                         {/* Browse Button */}
//                         <label className={styles.browseLabel}>
//                           Browse
//                           <input
//                             type="file"
//                             accept="image/*"
//                             style={{ display: "none" }}
//                             onChange={(e) => handleFileChange(index, e)}
//                           />
//                         </label>

//                         {/* Camera Button */}
//                         <button
//                           type="button"
//                           className={styles.cameraButton}
//                           onClick={() => handleOpenCamera(index)}
//                         >
//                           📷
//                         </button>

//                         {/* Image Preview - show new image or existing image */}
//                         {trialInputs[index]?.image && (
//                           <img
//                             src={URL.createObjectURL(trialInputs[index].image)}
//                             alt="Preview"
//                             className={styles.imagePreview}
//                           />
//                         )}
//                         {!trialInputs[index]?.image && trialInputs[index]?.existingImagePath && (
//                           <div className={styles.existingImageContainer}>
//                             <img
//                               src={`http://localhost:8000/${trialInputs[index].existingImagePath}`}
//                               alt="Existing img"
//                               className={styles.imagePreview}
//                             />
    
//                           </div>
//                         )}

//                         {/* Note Input */}
//                         <textarea
//                           placeholder="Note..."
//                           value={trialInputs[index]?.note || ""}
//                           onChange={(e) => handleNoteChange(index, e)}
//                           className={styles.noteInput}
//                           rows="1"
//                         />

//                         {/* Send Button Container with Check Icon */}
//                         <div className={styles.sendButtonContainer}>
//                           <button
//                             className={styles.sendButton}
//                             onClick={() => handleSend(index, trial)}
//                             disabled={sendStatus[index] === 'sending' || (!trialInputs[index]?.image && !trialInputs[index]?.note && !trialInputs[index]?.existingImagePath)}
//                           >
//                             {sendStatus[index] === 'sending' ? 'Sending...' : 'Send'}
//                           </button>
                          
//                           {/* Check Icon */}
//                           {sendStatus[index] === 'success' && (
//                             <div className={styles.checkIcon}>
//                               ✓
//                             </div>
//                           )}
                          
//                           {/* Error Icon */}
//                           {sendStatus[index] === 'error' && (
//                             <div className={styles.errorIcon}>
//                               ✗
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Camera Modals */}
//       {Object.keys(showCamera).map(index => 
//         showCamera[index] && (
//           <div key={index} className={styles.cameraModal}>
//             <div className={styles.cameraContainer}>
//               <Webcam
//                 audio={false}
//                 ref={el => webcamRefs.current[index] = el}
//                 screenshotFormat="image/jpeg"
//                 videoConstraints={videoConstraints}
//                 className={styles.webcam}
//               />
//               <div className={styles.cameraControls}>
//                 <button
//                   className={styles.captureButton}
//                   onClick={() => capturePhoto(index)}
//                 >
//                   Capture
//                 </button>
//                 <button
//                   className={styles.cancelButton}
//                   onClick={() => handleCloseCamera(index)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import axios from 'axios';
import styles from "./TrialsPage.module.css";
import ImageModal from "../Modals/ImageModal";

export default function TrialsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName, testId } = useParams();

  // const { trialsData, testInfo, deviceName } = location.state || {};
  const { trialsData, testInfo, deviceName, parentName } = location.state || {};

  // Photo capture states
  const [trialInputs, setTrialInputs] = useState({});
  const [showCamera, setShowCamera] = useState({});
  const [sendStatus, setSendStatus] = useState({});
  const [existingData, setExistingData] = useState({});
  const webcamRefs = useRef({});

  // Image modal states
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [selectedImageAlt, setSelectedImageAlt] = useState('');

  // Load existing data when component mounts
  useEffect(() => {
    if (trialsData && trialsData.length > 0) {
      loadExistingData();
    }
  }, [trialsData]);

  const loadExistingData = async () => {
    try {
      const promises = trialsData.map(async (trial, index) => {
        const testResultId = String(trial?.id || trial?.test_result_id || trial?.trial_number || index);
        
        try {
          const response = await axios.get(`http://localhost:8000/test-results/${testResultId}`);
          return { index, data: response.data };
        } catch (error) {
          console.log(`No existing data for trial ${testResultId}`);
          return { index, data: null };
        }
      });

      const results = await Promise.all(promises);
      const existingDataMap = {};
      
      results.forEach(({ index, data }) => {
        if (data) {
          existingDataMap[index] = data;
          
          // Pre-populate form if there's existing data
          if (data.note || data.image_path) {
            setTrialInputs(prev => ({
              ...prev,
              [index]: {
                note: data.note || '',
                image: null, // Will be handled separately for existing images
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

  // Photo capture callback - must be before early return
  const capturePhoto = useCallback((index) => {
    const imageSrc = webcamRefs.current[index]?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `trial-${index}-photo.jpg`, { type: 'image/jpeg' });
          setTrialInputs((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              image: file,
              existingImagePath: null // Clear existing image when new one is captured
            },
          }));
          setShowCamera(prev => ({ ...prev, [index]: false }));
        });
    }
  }, []);

  // Handle trial click to navigate to deflections page
  const handleTrialClick = (trial) => {
    navigate(
      `/projects/${encodeURIComponent(projectName)}/tests/${testId}/trials/${
        trial.id
      }/deflections`,
      {
        state: {
          deflectionsData: trial.deflections,
          trialInfo: trial,
          testInfo,
          projectName,
          deviceName,
          parentName,
        },
      }
    );
  };

  // Image modal functions
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

  // Photo capture functions
  const handleInputChange = (index, field, value) => {
    setTrialInputs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

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

  const handleNoteChange = (index, event) => {
    handleInputChange(index, "note", event.target.value);
  };

  const handleOpenCamera = (index) => {
    setShowCamera(prev => ({ ...prev, [index]: true }));
  };

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

  // Updated handleSend with same logic as TrialsModal
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

  // Prevent row click when interacting with photo controls
  const handlePhotoControlClick = (event) => {
    event.stopPropagation();
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

  if (!trialsData || trialsData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          {/* <button
            onClick={() => navigate("/display")}
            className={styles.breadcrumbLink}
          >
            Projects
          </button> */}
          <button
            onClick={() => {
              if (deviceName && parentName) {
                navigate(
                  `/devices/${encodeURIComponent(deviceName)}/parents/${encodeURIComponent(parentName)}/projects`
                );
              } else {
                navigate("/projects");
              }
            }}
            className={styles.breadcrumbLink}
          >
            Projects
          </button>
          <span> / </span>
          <button
            onClick={() =>
              navigate(`/projects/${encodeURIComponent(projectName)}/tests`, {
                // state: { projectName, deviceName },
                state: { projectName, deviceName, parentName },
              })
            }
            className={styles.breadcrumbLink}
          >
            {projectName}
          </button>
          <span> / Test {testId}</span>
        </div>

        <h2 className={styles.heading}>Trials for Test {testId}</h2>
        <p>No trials data available for this test.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => navigate(-1)}>Back</button>

      <h2 className={styles.heading}>Trials for Test {testId}</h2>
      
      {/* Trials Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Trial ID</th>
              <th>Trial Number</th>
              <th>Num of Deflections</th>
              <th>Photo & Notes</th>
            </tr>
          </thead>
          <tbody>
            {trialsData.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.noData}>
                  No trials found
                </td>
              </tr>
            ) : (
              trialsData.map((trial, index) => {
                const hasDeflections =
                  trial.deflections && trial.deflections.length > 0;
                const deflectionCount = trial.deflections
                  ? trial.deflections.length
                  : 0;

                return (
                  <tr
                    key={index}
                    onClick={
                      hasDeflections ? () => handleTrialClick(trial) : undefined
                    }
                    style={{
                      cursor: hasDeflections ? "pointer" : "default",
                      opacity: hasDeflections ? 1 : 0.6,
                    }}
                    className={
                      hasDeflections ? styles.clickableRow : styles.disabledRow
                    }
                  >
                    <td>
                      <strong className={styles.trialId}>{trial.id}</strong>
                    </td>
                    <td>{trial.trial_number}</td>
                    <td>
                      <span
                        className={
                          deflectionCount > 0
                            ? styles.deflectionCount
                            : styles.noDeflections
                        }
                      >
                        {deflectionCount}
                      </span>
                    </td>
                    <td onClick={handlePhotoControlClick}>
                      <div className={styles.photoControls}>
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

                        {/* Camera Button */}
                        <button
                          type="button"
                          className={styles.cameraButton}
                          onClick={() => handleOpenCamera(index)}
                        >
                          📷
                        </button>

                        {/* Image Preview - show new image or existing image with click handlers */}
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

                        {/* Note Input */}
                        <textarea
                          placeholder="Note..."
                          value={trialInputs[index]?.note || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                          className={styles.noteInput}
                          rows="1"
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Camera Modals */}
      {Object.keys(showCamera).map(index => 
        showCamera[index] && (
          <div key={index} className={styles.cameraModal}>
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
        )
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageModal}
        imageSrc={selectedImageSrc}
        altText={selectedImageAlt}
      />
    </div>
  );
}
