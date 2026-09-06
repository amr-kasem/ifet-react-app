// //test 2
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import HookMqtt from "../Mqtt1";
// import { useRef } from "react";
// import { useDispatch } from "react-redux";
// import { devicesActions } from "../../store/sensors-slice";
// import axios from "axios";
// import ProjectInformationTable from "../Project_Information_table/Project_Information_table";
// import CyclicStaticPressureTable from "../CyclicStaticPressureTable/CyclicStaticPressureTable";
// import ProjectModalInwardOutward from "../Modals/ProjectModalInwardOutward";
// import CyclicStaticPressureTableCustom from "../CyclicStaticPressureTableCustom/CyclicStaticPressureTableCustom";

// const Information = (props) => {
//   const dispatch = useDispatch();
//   const ref3 = useRef();
//   const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
//   const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
//   const [projectName, setProjectName] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
//   const [newProjectName, setNewProjectName] = useState(""); // State to store the new project name
//   const [projects, setProjects] = useState([]); // State to store the list of projects
//   const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
//   const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
//   const [fullLoadPositive, setfullLoadPositive] = useState(0);
//   const [fullLoadNegative, setfullLoadNegative] = useState(0);
//   const [projectID, setProjectId] = useState(0);
//   const [clicked, setClicked] = useState(false);
//   const [projectData, setProjectData] = useState(null);

//   const deviceID = props.deviceID;
//   const devices = useSelector((state) => state.devices["devices"]);
//   const neededDevice = devices.find((device) => device.deviceID === deviceID);
//   let toggle = neededDevice.toggle;
//   let status = neededDevice.status;
//   let custom_preset_toggle = neededDevice.custom_preset_toggle;

//   // Pass fetchProjects to parent (Device) when component mounts
//   useEffect(() => {
//     if (props.setFetchProjects) {
//       props.setFetchProjects(() => fetchProjects); // Pass the fetchProjects function to Device
//     }
//   }, [props.setFetchProjects]);

//   useEffect(() => {
//     props.setProjectId(projectID);
//   }, [projectID]);

//   const fetchProjects = (selectedProject = null, selectLastProject = true) => {
//     // console.log("fetching projects");
//     console.log("selectLastProject = ", selectLastProject);
//     axios
//       .get(
//         `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`
//       ) // edit /
//       .then((response) => {
//         console.log("*************", response.data);
//         setProjects(response.data); // Assuming the response data is an array of project objects

//         let projectToUse =
//           selectedProject || response.data[response.data.length - 1];

//         if (selectLastProject == false) {
//           console.log("omda testing project", projectID);
//           console.log(
//             "omda testing project",
//             response.data.find((project) => project.id === projectID)
//           );
//           projectToUse = response.data.find(
//             (project) => project.id === projectID
//           );
//         }

//         setProjectData(projectToUse);
//         // console.log("fetching projects => projectToUse", projectToUse);

//         if (projectToUse) {
//           console.log("test m7md1", selectedProject);
//           console.log("test m7md2", projectToUse);
//           setProjectId(projectToUse.id);
//           setProjectName(projectToUse.name);
//           setInwardDesignPressure(projectToUse.inward_design_pressure);
//           setOutwardDesignPressure(projectToUse.outward_design_pressure);

//           let static_tests_sorted = projectToUse.static_tests.sort(
//             (a, b) => a.index - b.index
//           );
//           // console.log("static_tests_sorted", static_tests_sorted);

//           let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
//             (a, b) => a.index - b.index
//           );
//           // console.log("cyclic_tests_sorted", cyclic_tests_sorted);

//           dispatch(
//             devicesActions.readCyclicTestsList({
//               deviceID: props.deviceID,
//               value: cyclic_tests_sorted,
//             })
//           );

//           dispatch(
//             devicesActions.readStaticTestsList({
//               deviceID: props.deviceID,
//               value: static_tests_sorted,
//             })
//           );

//           // dispatch(
//           //   devicesActions.setAllPageStatus({
//           //     deviceID: props.deviceID,
//           //     project_name: projectToUse.name,
//           //     design_load_positive: projectToUse.inward_design_pressure,
//           //     design_load_negative: projectToUse.outward_design_pressure,
//           //     current_index: 0,

//           //     current_index_1_positive: cyclic_tests_sorted[0].high_pressure,
//           //     current_index_1_Negative: cyclic_tests_sorted[0].low_pressure,
//           //     current_index_1_cycles: cyclic_tests_sorted[0].cycles,

//           //     current_index_2_positive: cyclic_tests_sorted[1].high_pressure,
//           //     current_index_2_Negative: cyclic_tests_sorted[1].low_pressure,
//           //     current_index_2_cycles: cyclic_tests_sorted[1].cycles,

//           //     current_index_3_positive: cyclic_tests_sorted[2].high_pressure,
//           //     current_index_3_Negative: cyclic_tests_sorted[2].low_pressure,
//           //     current_index_3_cycles: cyclic_tests_sorted[2].cycles,

//           //     current_index_4_positive: cyclic_tests_sorted[3].high_pressure,
//           //     current_index_4_Negative: cyclic_tests_sorted[3].low_pressure,
//           //     current_index_4_cycles: cyclic_tests_sorted[3].cycles,

//           //     current_index_5_positive: cyclic_tests_sorted[4].high_pressure,
//           //     current_index_5_Negative: cyclic_tests_sorted[4].low_pressure,
//           //     current_index_5_cycles: cyclic_tests_sorted[4].cycles,

//           //     current_index_6_positive: cyclic_tests_sorted[5].high_pressure,
//           //     current_index_6_Negative: cyclic_tests_sorted[5].low_pressure,
//           //     current_index_6_cycles: cyclic_tests_sorted[5].cycles,

//           //     current_index_7_positive: cyclic_tests_sorted[6].high_pressure,
//           //     current_index_7_Negative: cyclic_tests_sorted[6].low_pressure,
//           //     current_index_7_cycles: cyclic_tests_sorted[6].cycles,

//           //     current_index_8_positive: cyclic_tests_sorted[7].high_pressure,
//           //     current_index_8_Negative: cyclic_tests_sorted[7].low_pressure,
//           //     current_index_8_cycles: cyclic_tests_sorted[7].cycles,

//           //     current_index_1_finished: cyclic_tests_sorted[0].finished,
//           //     current_index_2_finished: cyclic_tests_sorted[1].finished,
//           //     current_index_3_finished: cyclic_tests_sorted[2].finished,
//           //     current_index_4_finished: cyclic_tests_sorted[3].finished,
//           //     current_index_5_finished: cyclic_tests_sorted[4].finished,
//           //     current_index_6_finished: cyclic_tests_sorted[5].finished,
//           //     current_index_7_finished: cyclic_tests_sorted[6].finished,
//           //     current_index_8_finished: cyclic_tests_sorted[7].finished,

//           //     static_index_1_pressure: static_tests_sorted[0].pressure,
//           //     static_index_1_duration: static_tests_sorted[0].duration,
//           //     static_index_2_pressure: static_tests_sorted[1].pressure,
//           //     static_index_2_duration: static_tests_sorted[1].duration,
//           //     static_index_3_pressure: static_tests_sorted[2].pressure,
//           //     static_index_3_duration: static_tests_sorted[2].duration,
//           //     static_index_4_pressure: static_tests_sorted[3].pressure,
//           //     static_index_4_duration: static_tests_sorted[3].duration,
//           //     static_index_5_pressure: static_tests_sorted[4].pressure,
//           //     static_index_5_duration: static_tests_sorted[4].duration,
//           //     static_index_6_pressure: static_tests_sorted[5].pressure,
//           //     static_index_6_duration: static_tests_sorted[5].duration,

//           //     static_index_1_finished: static_tests_sorted[0].finished,
//           //     static_index_2_finished: static_tests_sorted[1].finished,
//           //     static_index_3_finished: static_tests_sorted[2].finished,
//           //     static_index_4_finished: static_tests_sorted[3].finished,
//           //     static_index_5_finished: static_tests_sorted[4].finished,
//           //     static_index_6_finished: static_tests_sorted[5].finished,
//           //   })
//           // );

//           console.log("checkkkkk", projectToUse.static_tests);
//           // test custom logic
//           dispatch(
//             devicesActions.setCustomStaticRows({
//               deviceID: deviceID,
//               rows: projectToUse.static_tests.filter(
//                 (test) => test.preset === false
//               ),
//             })
//           );

//           dispatch(
//             devicesActions.setPresetStaticRows({
//               deviceID: deviceID,
//               rows: projectToUse.static_tests.filter(
//                 (test) => test.preset === true
//               ),
//             })
//           );

//           dispatch(
//             devicesActions.setCustomCyclicRows({
//               deviceID: deviceID,
//               rows: projectToUse.cyclic_tests.filter(
//                 (test) => test.preset === false
//               ),
//             })
//           );

//           dispatch(
//             devicesActions.setPresetCyclicRows({
//               deviceID: deviceID,
//               rows: projectToUse.cyclic_tests.filter(
//                 (test) => test.preset === true
//               ),
//             })
//           );
//           // test custom logic
//         }
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the projects!", error);
//       });
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     // console.log("status test" , status)
//     if (status == "idle") {
//       // console.log("status test fetch" , status)
//       fetchProjects(null, false);
//     }
//   }, [status]);

//   const handleNewProjectClick = () => {
//     setIsModalOpen(true); // Open modal
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false); // Close modal
//   };

//   const handleSaveNewProject = () => {
//     if (newProjectName.trim() !== "") {
//       // Send the new project name via axios POST request
//       axios
//         .post(
//           `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
//           {
//             name: newProjectName,
//             inward_design_pressure: parseFloat(inwardDesignPressure), // Use the updated state for inward pressure
//             outward_design_pressure: parseFloat(outwardDesignPressure), // Use the updated state for outward pressure
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           fetchProjects();
//           const newProject = response.data;
//           console.log("newProject", newProject);
//           setProjectId(newProject.id); // Select the new project by ID
//           setProjectName(newProject.name); // Set the project name
//           setInwardDesignPressure(newProject.inward_design_pressure);
//           setOutwardDesignPressure(newProject.outward_design_pressure);

//           let static_tests_sorted = newProject.static_tests.sort(
//             (a, b) => a.index - b.index
//           );
//           console.log("static_tests_sorted", static_tests_sorted);

//           let cyclic_tests_sorted = newProject.cyclic_tests.sort(
//             (a, b) => a.index - b.index
//           );
//           console.log("cyclic_tests_sorted", cyclic_tests_sorted);

//           dispatch(
//             devicesActions.readCyclicTestsList({
//               deviceID: props.deviceID,
//               value: cyclic_tests_sorted,
//             })
//           );

//           dispatch(
//             devicesActions.readStaticTestsList({
//               deviceID: props.deviceID,
//               value: static_tests_sorted,
//             })
//           );

//           dispatch(
//             devicesActions.setAllPageStatus({
//               deviceID: props.deviceID,
//               project_name: newProjectName,
//               design_load_positive: newProject.inward_design_pressure,
//               design_load_negative: newProject.outward_design_pressure,
//               current_index: 0,

//               current_index_1_positive: cyclic_tests_sorted[0].high_pressure,
//               current_index_1_Negative: cyclic_tests_sorted[0].low_pressure,
//               current_index_1_cycles: cyclic_tests_sorted[0].cycles,

//               current_index_2_positive: cyclic_tests_sorted[1].high_pressure,
//               current_index_2_Negative: cyclic_tests_sorted[1].low_pressure,
//               current_index_2_cycles: cyclic_tests_sorted[1].cycles,

//               current_index_3_positive: cyclic_tests_sorted[2].high_pressure,
//               current_index_3_Negative: cyclic_tests_sorted[2].low_pressure,
//               current_index_3_cycles: cyclic_tests_sorted[2].cycles,

//               current_index_4_positive: cyclic_tests_sorted[3].high_pressure,
//               current_index_4_Negative: cyclic_tests_sorted[3].low_pressure,
//               current_index_4_cycles: cyclic_tests_sorted[3].cycles,

//               current_index_5_positive: cyclic_tests_sorted[4].high_pressure,
//               current_index_5_Negative: cyclic_tests_sorted[4].low_pressure,
//               current_index_5_cycles: cyclic_tests_sorted[4].cycles,

//               current_index_6_positive: cyclic_tests_sorted[5].high_pressure,
//               current_index_6_Negative: cyclic_tests_sorted[5].low_pressure,
//               current_index_6_cycles: cyclic_tests_sorted[5].cycles,

//               current_index_7_positive: cyclic_tests_sorted[6].high_pressure,
//               current_index_7_Negative: cyclic_tests_sorted[6].low_pressure,
//               current_index_7_cycles: cyclic_tests_sorted[6].cycles,

//               current_index_8_positive: cyclic_tests_sorted[7].high_pressure,
//               current_index_8_Negative: cyclic_tests_sorted[7].low_pressure,
//               current_index_8_cycles: cyclic_tests_sorted[7].cycles,

//               current_index_1_finished: cyclic_tests_sorted[0].finished,
//               current_index_2_finished: cyclic_tests_sorted[1].finished,
//               current_index_3_finished: cyclic_tests_sorted[2].finished,
//               current_index_4_finished: cyclic_tests_sorted[3].finished,
//               current_index_5_finished: cyclic_tests_sorted[4].finished,
//               current_index_6_finished: cyclic_tests_sorted[5].finished,
//               current_index_7_finished: cyclic_tests_sorted[6].finished,
//               current_index_8_finished: cyclic_tests_sorted[7].finished,

//               static_index_1_pressure: static_tests_sorted[0].pressure,
//               static_index_1_duration: static_tests_sorted[0].duration,
//               static_index_2_pressure: static_tests_sorted[1].pressure,
//               static_index_2_duration: static_tests_sorted[1].duration,
//               static_index_3_pressure: static_tests_sorted[2].pressure,
//               static_index_3_duration: static_tests_sorted[2].duration,
//               static_index_4_pressure: static_tests_sorted[3].pressure,
//               static_index_4_duration: static_tests_sorted[3].duration,
//               static_index_5_pressure: static_tests_sorted[4].pressure,
//               static_index_5_duration: static_tests_sorted[4].duration,
//               static_index_6_pressure: static_tests_sorted[5].pressure,
//               static_index_6_duration: static_tests_sorted[5].duration,

//               static_index_1_finished: static_tests_sorted[0].finished,
//               static_index_2_finished: static_tests_sorted[1].finished,
//               static_index_3_finished: static_tests_sorted[2].finished,
//               static_index_4_finished: static_tests_sorted[3].finished,
//               static_index_5_finished: static_tests_sorted[4].finished,
//               static_index_6_finished: static_tests_sorted[5].finished,
//             })
//           );

//           console.log("Cancel Resume");
//           ref3.current.mqttPub({
//             topic: `device${deviceID}/resume_cancel`,
//             qos: 1,
//             payload: "cancel",
//           });
//         })
//         .catch((error) => {
//           console.error("There was an error creating the new project!", error);
//         })
//         .finally(() => {
//           setNewProjectName(""); // Clear the input after saving
//           handleModalClose(); // Close the modal
//         });
//     }
//   };

//   const handleSaveEditClick = () => {
//     if (isEditable) {
//       axios
//         .put(
//           `http://${window.location.hostname}:8000/projects/${projectID}`,
//           {
//             name: projectName,
//             inward_design_pressure: parseFloat(inwardDesignPressure), // Use the updated state for inward pressure
//             outward_design_pressure: parseFloat(outwardDesignPressure), // Use the updated state for outward pressure
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           console.log("Data saved successfully", response.data);
//           fetchProjects();
//         })
//         .catch((error) => {
//           console.error("Error saving data", error);
//         });
//       setIsEditable(!isEditable); // Toggle the editable state
//     } else {
//       setIsEditable(!isEditable); // Toggle the editable state
//     }
//   };

//   function validateInput(value, setter) {
//     if (value === "" || isNaN(value)) {
//       setter(0);
//     }
//   }

//   useEffect(() => {
//     const positiveLoad = neededDevice.design_load_positive;
//     const negativeLoad = neededDevice.design_load_negative;
//     const projectNameee = neededDevice.project_name;
//     if (positiveLoad !== null) {
//       setPositiveDesignLoad(parseFloat(positiveLoad));
//     }
//     if (negativeLoad !== null) {
//       setNegativeDesignLoad(parseFloat(negativeLoad));
//     }
//     if (projectNameee !== null) {
//       setProjectName(projectNameee);
//     }
//   }, [
//     neededDevice.design_load_positive,
//     neededDevice.design_load_negative,
//     neededDevice.project_name,
//   ]);

//   useEffect(() => {
//     dispatch(
//       devicesActions.setAllPageStatus({
//         deviceID: props.deviceID,
//         project_name: projectName,
//         design_load_positive: inwardDesignPressure,
//         design_load_negative: outwardDesignPressure,
//       })
//     );
//   }, [projectName, inwardDesignPressure, outwardDesignPressure]);

//   function updateTable() {
//     setfullLoadPositive(
//       positiveDesignLoad && (positiveDesignLoad * 1.5).toFixed(2)
//     );
//     setfullLoadNegative(
//       negativeDesignLoad && (negativeDesignLoad * 1.5).toFixed(2)
//     );
//   }

//   useEffect(() => {
//     updateTable();
//   }, [
//     positiveDesignLoad,
//     negativeDesignLoad,
//     fullLoadPositive,
//     fullLoadNegative,
//   ]);

//   const HandlePositiveDesignLoad = (e) => {
//     if (neededDevice.init == true) {
//       setClicked(true);
//     }
//     const inputValue = e.target.value;
//     // Check if the input value is a valid number (integer or floating point)
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       // Updated regular expression to allow for an optional "-"
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setInwardDesignPressure);
//       setInwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   const HandleNegativeDesignLoad = (e) => {
//     setClicked(true);
//     const inputValue = e.target.value;
//     // Check if the input value is a valid integer (including negative numbers)
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setOutwardDesignPressure);
//       setOutwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   const HandleProjectName = (e) => {
//     const selectedProjectId = parseInt(e.target.value);
//     const selectedProject = projects.find(
//       (project) => project.id === selectedProjectId
//     );

//     console.log("selectedProject", selectedProject);
//     if (selectedProject) {
//       setProjectId(selectedProject.id); // Set the project ID
//       setProjectName(selectedProject.name); // Set the project name
//     }
//     fetchProjects(selectedProject);
//   };

//   useEffect(() => {
//     console.log("omdaaaaaaaaaaa", projectData);
//     if (projectData !== null) {
//       // console.log("omdain",projectData)
//       fetchProjects(projectData);
//     }
//   }, [neededDevice.toggle, neededDevice.notify]);

//   return (
//     <>
//       <HookMqtt ref={ref3} topics={[]} />

//       <ProjectInformationTable
//         projectID={projectID}
//         HandleProjectName={HandleProjectName}
//         projects={projects}
//         deviceID={deviceID}
//         isEditable={isEditable}
//         status={status}
//         handleSaveEditClick={handleSaveEditClick}
//         handleNewProjectClick={handleNewProjectClick}
//         positiveDesignLoad={inwardDesignPressure}
//         negativeDesignLoad={outwardDesignPressure}
//         HandlePositiveDesignLoad={HandlePositiveDesignLoad}
//         HandleNegativeDesignLoad={HandleNegativeDesignLoad}
//         setProjectName={setProjectName}
//         projectName={projectName}
//       />

//       <CyclicStaticPressureTable
//         toggle={toggle}
//         designLoadPositive={inwardDesignPressure}
//         designLoadNegative={outwardDesignPressure}
//         fullLoadPositive={fullLoadPositive}
//         fullLoadNegative={fullLoadNegative}
//         neededDevice={neededDevice}
//         clicked={clicked}
//         isEditable={isEditable}
//         status={status}
//         projectID={projectID}
//         setProjectData={setProjectData}
//       />

//       <ProjectModalInwardOutward
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//         onSave={handleSaveNewProject} // Pass specific save function here
//         newProjectName={newProjectName}
//         setNewProjectName={setNewProjectName}
//         inwardDesignPressure={inwardDesignPressure}
//         setInwardDesignPressure={setInwardDesignPressure}
//         outwardDesignPressure={outwardDesignPressure}
//         setOutwardDesignPressure={setOutwardDesignPressure}
//       />
//     </>
//   );
// };

// export default Information;

//test 2
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HookMqtt from "../Mqtt1";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { devicesActions } from "../../store/sensors-slice";
import axios from "axios";
import ProjectInformationTable from "../Project_Information_table/Project_Information_table";
import CyclicStaticPressureTable from "../CyclicStaticPressureTable/CyclicStaticPressureTable";
import ProjectModalInwardOutward from "../Modals/ProjectModalInwardOutward";
import CyclicStaticPressureTableCustom from "../CyclicStaticPressureTableCustom/CyclicStaticPressureTableCustom";

const Information = (props) => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
  const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [newProjectName, setNewProjectName] = useState(""); // State to store the new project name
  const [projects, setProjects] = useState([]); // State to store the list of projects
  const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
  const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
  const [fullLoadPositive, setfullLoadPositive] = useState(0);
  const [fullLoadNegative, setfullLoadNegative] = useState(0);
  const [projectID, setProjectId] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [parents, setParents] = useState([]); // State to store the list of parents
  const [selectedParent, setSelectedParent] = useState("legacy"); // State for selected parent

  const deviceID = props.deviceID;
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);
  let toggle = neededDevice.toggle;
  let status = neededDevice.status;
  let custom_preset_toggle = neededDevice.custom_preset_toggle;

  // Pass fetchProjects to parent (Device) when component mounts
  useEffect(() => {
    if (props.setFetchProjects) {
      props.setFetchProjects(() => fetchProjects); // Pass the fetchProjects function to Device
    }
  }, [props.setFetchProjects]);

  useEffect(() => {
    props.setProjectId(projectID);
  }, [projectID]);


  // const fetchProjects = (selectedProject = null, selectLastProject = true) => {
  //   console.log("selectLastProject = ", selectLastProject);

  //   // Updated to use port 12345
  //   axios
  //     .get(
  //       `http://${window.location.hostname}:12345/devices/${props.deviceID}/projects`
  //     )
  //     .then((response) => {
  //       console.log("*************", response.data);
  //       setProjects(response.data);

  //       let projectToUse =
  //         selectedProject || response.data[response.data.length - 1];

  //       if (selectLastProject == false) {
  //         console.log("omda testing project", projectID);
  //         console.log(
  //           "omda testing project",
  //           response.data.find((project) => project.id === projectID)
  //         );
  //         projectToUse = response.data.find(
  //           (project) => project.id === projectID
  //         );
  //       }

  //       setProjectData(projectToUse);

  //       if (projectToUse) {
  //         console.log("test m7md1", selectedProject);
  //         console.log("test m7md2", projectToUse);
  //         setProjectId(projectToUse.id);
  //         setProjectName(projectToUse.name);
  //         setInwardDesignPressure(projectToUse.inward_design_pressure);
  //         setOutwardDesignPressure(projectToUse.outward_design_pressure);

  //         // Handle parent selection - this will now work with the parent field
  //         if (
  //           projectToUse.parent_id &&
  //           parents.find((p) => p.value === projectToUse.parent_id)
  //         ) {
  //           setSelectedParent(projectToUse.parent_id);
  //         } else {
  //           setSelectedParent("legacy");
  //         }

  //         let static_tests_sorted = projectToUse.static_tests.sort(
  //           (a, b) => a.index - b.index
  //         );

  //         let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
  //           (a, b) => a.index - b.index
  //         );

  //         dispatch(
  //           devicesActions.readCyclicTestsList({
  //             deviceID: props.deviceID,
  //             value: cyclic_tests_sorted,
  //           })
  //         );

  //         dispatch(
  //           devicesActions.readStaticTestsList({
  //             deviceID: props.deviceID,
  //             value: static_tests_sorted,
  //           })
  //         );

  //         console.log("checkkkkk", projectToUse.static_tests);

  //         // Custom logic dispatches
  //         dispatch(
  //           devicesActions.setCustomStaticRows({
  //             deviceID: deviceID,
  //             rows: projectToUse.static_tests.filter(
  //               (test) => test.preset === false
  //             ),
  //           })
  //         );

  //         dispatch(
  //           devicesActions.setPresetStaticRows({
  //             deviceID: deviceID,
  //             rows: projectToUse.static_tests.filter(
  //               (test) => test.preset === true
  //             ),
  //           })
  //         );

  //         dispatch(
  //           devicesActions.setCustomCyclicRows({
  //             deviceID: deviceID,
  //             rows: projectToUse.cyclic_tests.filter(
  //               (test) => test.preset === false
  //             ),
  //           })
  //         );

  //         dispatch(
  //           devicesActions.setPresetCyclicRows({
  //             deviceID: deviceID,
  //             rows: projectToUse.cyclic_tests.filter(
  //               (test) => test.preset === true
  //             ),
  //           })
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the projects!", error);
  //     });
  // };

  const fetchProjects = (selectedProject = null, selectLastProject = true) => {
  console.log("selectLastProject = ", selectLastProject);
  console.log("selectedParent being sent = ", selectedParent);

  // Build the URL with parent query parameter
  const baseUrl = `http://${window.location.hostname}:12345/devices/${props.deviceID}/projects`;
  const url = selectedParent && selectedParent !== "all" 
    ? `${baseUrl}?parent=${encodeURIComponent(selectedParent)}`
    : baseUrl;

  axios
    .get(url)
    .then((response) => {
      console.log("*************", response.data);
      setProjects(response.data);

      let projectToUse =
        selectedProject || response.data[response.data.length - 1];

      if (selectLastProject == false) {
        console.log("omda testing project", projectID);
        console.log(
          "omda testing project",
          response.data.find((project) => project.id === projectID)
        );
        projectToUse = response.data.find(
          (project) => project.id === projectID
        );
      }

      setProjectData(projectToUse);

      if (projectToUse) {
        console.log("test m7md1", selectedProject);
        console.log("test m7md2", projectToUse);
        setProjectId(projectToUse.id);
        setProjectName(projectToUse.name);
        setInwardDesignPressure(projectToUse.inward_design_pressure);
        setOutwardDesignPressure(projectToUse.outward_design_pressure);

        // Handle parent selection
        if (
          projectToUse.parent_id &&
          parents.find((p) => p.value === projectToUse.parent_id)
        ) {
          setSelectedParent(projectToUse.parent_id);
        } else {
          setSelectedParent("legacy");
        }

        let static_tests_sorted = projectToUse.static_tests.sort(
          (a, b) => a.index - b.index
        );

        let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
          (a, b) => a.index - b.index
        );

        dispatch(
          devicesActions.readCyclicTestsList({
            deviceID: props.deviceID,
            value: cyclic_tests_sorted,
          })
        );

        dispatch(
          devicesActions.readStaticTestsList({
            deviceID: props.deviceID,
            value: static_tests_sorted,
          })
        );

        console.log("checkkkkk", projectToUse.static_tests);

        // Custom logic dispatches
        dispatch(
          devicesActions.setCustomStaticRows({
            deviceID: deviceID,
            rows: projectToUse.static_tests.filter(
              (test) => test.preset === false
            ),
          })
        );

        dispatch(
          devicesActions.setPresetStaticRows({
            deviceID: deviceID,
            rows: projectToUse.static_tests.filter(
              (test) => test.preset === true
            ),
          })
        );

        dispatch(
          devicesActions.setCustomCyclicRows({
            deviceID: deviceID,
            rows: projectToUse.cyclic_tests.filter(
              (test) => test.preset === false
            ),
          })
        );

        dispatch(
          devicesActions.setPresetCyclicRows({
            deviceID: deviceID,
            rows: projectToUse.cyclic_tests.filter(
              (test) => test.preset === true
            ),
          })
        );
      }
    })
    .catch((error) => {
      console.error("There was an error fetching the projects!", error);
    });
};


  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // console.log("status test" , status)
    if (status == "idle") {
      // console.log("status test fetch" , status)
      fetchProjects(null, false);
    }
  }, [status]);

  const handleNewProjectClick = () => {
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleSaveNewProject = () => {
    if (newProjectName.trim() !== "") {
      // Send the new project name via axios POST request
      axios
        .post(
          `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
          {
            name: newProjectName,
            inward_design_pressure: parseFloat(inwardDesignPressure), // Use the updated state for inward pressure
            outward_design_pressure: parseFloat(outwardDesignPressure), // Use the updated state for outward pressure
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          fetchProjects();
          const newProject = response.data;
          console.log("newProject", newProject);
          setProjectId(newProject.id); // Select the new project by ID
          setProjectName(newProject.name); // Set the project name
          setInwardDesignPressure(newProject.inward_design_pressure);
          setOutwardDesignPressure(newProject.outward_design_pressure);

          let static_tests_sorted = newProject.static_tests.sort(
            (a, b) => a.index - b.index
          );
          console.log("static_tests_sorted", static_tests_sorted);

          let cyclic_tests_sorted = newProject.cyclic_tests.sort(
            (a, b) => a.index - b.index
          );
          console.log("cyclic_tests_sorted", cyclic_tests_sorted);

          dispatch(
            devicesActions.readCyclicTestsList({
              deviceID: props.deviceID,
              value: cyclic_tests_sorted,
            })
          );

          dispatch(
            devicesActions.readStaticTestsList({
              deviceID: props.deviceID,
              value: static_tests_sorted,
            })
          );

          dispatch(
            devicesActions.setAllPageStatus({
              deviceID: props.deviceID,
              project_name: newProjectName,
              design_load_positive: newProject.inward_design_pressure,
              design_load_negative: newProject.outward_design_pressure,
              current_index: 0,

              current_index_1_positive: cyclic_tests_sorted[0].high_pressure,
              current_index_1_Negative: cyclic_tests_sorted[0].low_pressure,
              current_index_1_cycles: cyclic_tests_sorted[0].cycles,

              current_index_2_positive: cyclic_tests_sorted[1].high_pressure,
              current_index_2_Negative: cyclic_tests_sorted[1].low_pressure,
              current_index_2_cycles: cyclic_tests_sorted[1].cycles,

              current_index_3_positive: cyclic_tests_sorted[2].high_pressure,
              current_index_3_Negative: cyclic_tests_sorted[2].low_pressure,
              current_index_3_cycles: cyclic_tests_sorted[2].cycles,

              current_index_4_positive: cyclic_tests_sorted[3].high_pressure,
              current_index_4_Negative: cyclic_tests_sorted[3].low_pressure,
              current_index_4_cycles: cyclic_tests_sorted[3].cycles,

              current_index_5_positive: cyclic_tests_sorted[4].high_pressure,
              current_index_5_Negative: cyclic_tests_sorted[4].low_pressure,
              current_index_5_cycles: cyclic_tests_sorted[4].cycles,

              current_index_6_positive: cyclic_tests_sorted[5].high_pressure,
              current_index_6_Negative: cyclic_tests_sorted[5].low_pressure,
              current_index_6_cycles: cyclic_tests_sorted[5].cycles,

              current_index_7_positive: cyclic_tests_sorted[6].high_pressure,
              current_index_7_Negative: cyclic_tests_sorted[6].low_pressure,
              current_index_7_cycles: cyclic_tests_sorted[6].cycles,

              current_index_8_positive: cyclic_tests_sorted[7].high_pressure,
              current_index_8_Negative: cyclic_tests_sorted[7].low_pressure,
              current_index_8_cycles: cyclic_tests_sorted[7].cycles,

              current_index_1_finished: cyclic_tests_sorted[0].finished,
              current_index_2_finished: cyclic_tests_sorted[1].finished,
              current_index_3_finished: cyclic_tests_sorted[2].finished,
              current_index_4_finished: cyclic_tests_sorted[3].finished,
              current_index_5_finished: cyclic_tests_sorted[4].finished,
              current_index_6_finished: cyclic_tests_sorted[5].finished,
              current_index_7_finished: cyclic_tests_sorted[6].finished,
              current_index_8_finished: cyclic_tests_sorted[7].finished,

              static_index_1_pressure: static_tests_sorted[0].pressure,
              static_index_1_duration: static_tests_sorted[0].duration,
              static_index_2_pressure: static_tests_sorted[1].pressure,
              static_index_2_duration: static_tests_sorted[1].duration,
              static_index_3_pressure: static_tests_sorted[2].pressure,
              static_index_3_duration: static_tests_sorted[2].duration,
              static_index_4_pressure: static_tests_sorted[3].pressure,
              static_index_4_duration: static_tests_sorted[3].duration,
              static_index_5_pressure: static_tests_sorted[4].pressure,
              static_index_5_duration: static_tests_sorted[4].duration,
              static_index_6_pressure: static_tests_sorted[5].pressure,
              static_index_6_duration: static_tests_sorted[5].duration,

              static_index_1_finished: static_tests_sorted[0].finished,
              static_index_2_finished: static_tests_sorted[1].finished,
              static_index_3_finished: static_tests_sorted[2].finished,
              static_index_4_finished: static_tests_sorted[3].finished,
              static_index_5_finished: static_tests_sorted[4].finished,
              static_index_6_finished: static_tests_sorted[5].finished,
            })
          );

          console.log("Cancel Resume");
          ref3.current.mqttPub({
            topic: `device${deviceID}/resume_cancel`,
            qos: 1,
            payload: "cancel",
          });
        })
        .catch((error) => {
          console.error("There was an error creating the new project!", error);
        })
        .finally(() => {
          setNewProjectName(""); // Clear the input after saving
          handleModalClose(); // Close the modal
        });
    }
  };

  const handleSaveEditClick = () => {
    if (isEditable) {
      axios
        .put(
          `http://${window.location.hostname}:8000/projects/${projectID}`,
          {
            name: projectName,
            inward_design_pressure: parseFloat(inwardDesignPressure), // Use the updated state for inward pressure
            outward_design_pressure: parseFloat(outwardDesignPressure), // Use the updated state for outward pressure
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Data saved successfully", response.data);
          fetchProjects();
        })
        .catch((error) => {
          console.error("Error saving data", error);
        });
      setIsEditable(!isEditable); // Toggle the editable state
    } else {
      setIsEditable(!isEditable); // Toggle the editable state
    }
  };

  function validateInput(value, setter) {
    if (value === "" || isNaN(value)) {
      setter(0);
    }
  }

  useEffect(() => {
    const positiveLoad = neededDevice.design_load_positive;
    const negativeLoad = neededDevice.design_load_negative;
    const projectNameee = neededDevice.project_name;
    if (positiveLoad !== null) {
      setPositiveDesignLoad(parseFloat(positiveLoad));
    }
    if (negativeLoad !== null) {
      setNegativeDesignLoad(parseFloat(negativeLoad));
    }
    if (projectNameee !== null) {
      setProjectName(projectNameee);
    }
  }, [
    neededDevice.design_load_positive,
    neededDevice.design_load_negative,
    neededDevice.project_name,
  ]);

  useEffect(() => {
    dispatch(
      devicesActions.setAllPageStatus({
        deviceID: props.deviceID,
        project_name: projectName,
        design_load_positive: inwardDesignPressure,
        design_load_negative: outwardDesignPressure,
      })
    );
  }, [projectName, inwardDesignPressure, outwardDesignPressure]);

  function updateTable() {
    setfullLoadPositive(
      positiveDesignLoad && (positiveDesignLoad * 1.5).toFixed(2)
    );
    setfullLoadNegative(
      negativeDesignLoad && (negativeDesignLoad * 1.5).toFixed(2)
    );
  }

  useEffect(() => {
    updateTable();
  }, [
    positiveDesignLoad,
    negativeDesignLoad,
    fullLoadPositive,
    fullLoadNegative,
  ]);

  const HandlePositiveDesignLoad = (e) => {
    if (neededDevice.init == true) {
      setClicked(true);
    }
    const inputValue = e.target.value;
    // Check if the input value is a valid number (integer or floating point)
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      // Updated regular expression to allow for an optional "-"
      const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
      validateInput(parsedValue, setInwardDesignPressure);
      setInwardDesignPressure(parsedValue);
      updateTable();
    }
  };

  const HandleNegativeDesignLoad = (e) => {
    setClicked(true);
    const inputValue = e.target.value;
    // Check if the input value is a valid integer (including negative numbers)
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
      validateInput(parsedValue, setOutwardDesignPressure);
      setOutwardDesignPressure(parsedValue);
      updateTable();
    }
  };

  // In your HandleProjectName function, add parent handling:
  const HandleProjectName = (e) => {
    const selectedProjectId = parseInt(e.target.value);
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );

    console.log("selectedProject", selectedProject);
    if (selectedProject) {
      setProjectId(selectedProject.id);
      setProjectName(selectedProject.name);

      // Auto-select parent based on project's parent field
      if (
        selectedProject.parent_id &&
        parents.find((p) => p.value === selectedProject.parent_id)
      ) {
        setSelectedParent(selectedProject.parent_id);
      } else {
        setSelectedParent("legacy");
      }
    }
    fetchProjects(selectedProject);
  };

  useEffect(() => {
    console.log("omdaaaaaaaaaaa", projectData);
    if (projectData !== null) {
      // console.log("omdain",projectData)
      fetchProjects(projectData);
    }
  }, [neededDevice.toggle, neededDevice.notify]);

  const fetchParents = () => {
    axios
      .get(`http://${window.location.hostname}:12345/parents`)
      .then((response) => {
        console.log("Parents fetched:", response.data);
        setParents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the parents!", error);
        // Set default parents if API fails
        setParents([{ id: 0, name: "Legacy", value: "legacy" }]);
      });
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <>
      <HookMqtt ref={ref3} topics={[]} />

      <ProjectInformationTable
        projectID={projectID}
        HandleProjectName={HandleProjectName}
        projects={projects}
        deviceID={deviceID}
        isEditable={isEditable}
        status={status}
        handleSaveEditClick={handleSaveEditClick}
        handleNewProjectClick={handleNewProjectClick}
        positiveDesignLoad={inwardDesignPressure}
        negativeDesignLoad={outwardDesignPressure}
        HandlePositiveDesignLoad={HandlePositiveDesignLoad}
        HandleNegativeDesignLoad={HandleNegativeDesignLoad}
        setProjectName={setProjectName}
        projectName={projectName}
        parents={parents}
        selectedParent={selectedParent}
        setSelectedParent={setSelectedParent}
      />

      <CyclicStaticPressureTable
        toggle={toggle}
        designLoadPositive={inwardDesignPressure}
        designLoadNegative={outwardDesignPressure}
        fullLoadPositive={fullLoadPositive}
        fullLoadNegative={fullLoadNegative}
        neededDevice={neededDevice}
        clicked={clicked}
        isEditable={isEditable}
        status={status}
        projectID={projectID}
        setProjectData={setProjectData}
      />

      <ProjectModalInwardOutward
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveNewProject} // Pass specific save function here
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        inwardDesignPressure={inwardDesignPressure}
        setInwardDesignPressure={setInwardDesignPressure}
        outwardDesignPressure={outwardDesignPressure}
        setOutwardDesignPressure={setOutwardDesignPressure}
      />
    </>
  );
};

export default Information;
