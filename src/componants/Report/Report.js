// import React, { useState, useEffect} from 'react';
// import { useParams } from 'react-router-dom'; // Import the useParams hook
// import InfiltrationTest from './InfiltrationTest';
// import MissileTest from './MissileTest';
// import CyclicTest from './CyclicTest';
// import StaticTest from './StaticTest';
// import axios from 'axios';
// import { useDispatch , useSelector } from 'react-redux';

// const Report = () => {
//   const { projectId } = useParams(); // Get the project_id from the URL
//   const [projectData, setProjectData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const testsData = useSelector((state) => state.tests);

//   useEffect(() => {
//     const fetchProjectData = async () => {
//       try {
//         const response = await axios.get(`http://${window.location.hostname}:8000/projects/${projectId}`);
//         console.log(response.data);
//         setProjectData(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };

//     fetchProjectData();
//   }, [projectId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading project data: {error.message}</div>;


//   const handleSend = async () => {
//     try {
//       let payload = {
//         name: projectData?.name || "default_name",
//         static_tests: [], // Assuming empty for now
//         infiltration_tests: [], // Assuming empty for now
//         missile_impact_tests: [{
//           missile: "string",  // Default value
//           missile_weight: 0,  // Default value
//           id: projectId,  // Set to project ID
//           shots: testsData.missileTest.map((shot) => ({
//             area: shot.area || 0,
//             velocity: shot.velocity || 0,
//             result: shot.result || false,
//             note: shot.note || "",
//             id: shot.id || 0
//           }))
//         }],
//         cyclic_tests: [], // Assuming empty for now
//       };


//       payload = {
//         "name": "string",
//         "device_id": 1,
//         "static_tests": [
//           {
//             "pressure_factor": 0,
//             "pressure": 0,
//             "id": 0,
//             "deflections": []
//           }
//         ],
//         "infiltration_tests": [
//           {
//             "type": "string",
//             "pressure": 0,
//             "id": 0,
//             "duration": 0,
//             "leakage": 0
//           }
//         ],
//         "missile_impact_tests": [
//           {
//             "missile": "string",
//             "missile_weight": 0,
//             "id": 0,
//             "shots": [
//               {
//                 "area": 0,
//                 "velocity": 0,
//                 "result": true,
//                 "note": "string",
//                 "id": 0
//               }
//             ]
//           }
//         ],
//         "cyclic_tests": [
//           {
//             "type": "string",
//             "cycles": 0,
//             "low_pressure": 0,
//             "high_pressure": 0,
//             "id": 0,
//             "deflection": 0,
//             "permanent_set": 0,
//             "result": true,
//             "note": "string"
//           }
//         ]
//       }
      
  
//       console.log('Payload:', payload);
//       await axios.put(`http://${window.location.hostname}:8000/projects/${projectId}`, payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       alert('Data sent successfully!');
//     } catch (error) {
//       console.error('Error sending data:', error);
//     }
//   };
  
  
  
  

//   return (
//     <div>
//       <StaticTest projectData={projectData} />
//       <CyclicTest projectData={projectData} />
//       {/* <MissileTest projectData={projectData} /> */}
//       {/* <InfiltrationTest projectData={projectData} /> */}
//       {/* <button onClick={handleSend}>Send</button> */}
//     </div>
//   );
// };

// export default Report;


import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import InfiltrationTest from './InfiltrationTest';
import MissileTest from './MissileTest';
import CyclicTest from './CyclicTest';
import StaticTest from './StaticTest';
import axios from 'axios';
import { useDispatch , useSelector } from 'react-redux';

const Report = () => {
  const { deviceID, projectID } = useParams(); // Get the deviceID and projectID from the URL
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const testsData = useSelector((state) => state.tests);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://${window.location.hostname}:8000/devices/${deviceID}/projects/`); //edit /
        // console.log(response.data);
        // console.log("projectId",parseInt(projectID))
        const projectWithId = response.data.find(project => project.id === parseInt(projectID)); // Correct capitalization
        console.log(projectWithId);
        setProjectData(projectWithId);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectID, deviceID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading project data: {error.message}</div>;


  return (
    <div>
      <StaticTest projectData={projectData} />
      {/* <CyclicTest projectData={projectData} /> */}
      {/* <MissileTest projectData={projectData} /> */}
      {/* <InfiltrationTest projectData={projectData} /> */}
      {/* <button onClick={handleSend}>Send</button> */}
    </div>
  );
};

export default Report;
