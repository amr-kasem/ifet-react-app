// // Information.js
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
// import ParentAddModal from "../Modals/ParentAddModal";

// const Information = (props) => {
//   const dispatch = useDispatch();
//   const ref3 = useRef();
//   const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
//   const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
//   const [projectName, setProjectName] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
//   const [newProjectName, setNewProjectName] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
//   const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
//   const [fullLoadPositive, setfullLoadPositive] = useState(0);
//   const [fullLoadNegative, setfullLoadNegative] = useState(0);
//   const [projectID, setProjectId] = useState(0);
//   const [clicked, setClicked] = useState(false);
//   const [projectData, setProjectData] = useState(null);
//   const [parents, setParents] = useState([]);
//   const [selectedParent, setSelectedParent] = useState("legacy"); // Default to "legacy"
//   const [newParent, setNewParent] = useState("legacy"); // Default to "legacy"

//   const deviceID = props.deviceID;
//   const devices = useSelector((state) => state.devices["devices"]);
//   const neededDevice = devices.find((device) => device.deviceID === deviceID);
//   let toggle = neededDevice.toggle;
//   let status = neededDevice.status;

//   // Pass fetchProjects to parent (Device) when component mounts
//   useEffect(() => {
//     if (props.setFetchProjects) {
//       props.setFetchProjects(() => fetchProjects);
//     }
//   }, [props.setFetchProjects]);

//   useEffect(() => {
//     props.setProjectId(projectID);
//   }, [projectID]);

//   // const fetchProjects = (selectedProject = null, selectLastProject = true) => {
//   //   console.log("selectLastProject = ", selectLastProject);
//   //   console.log("selectedParent being sent = ", selectedParent);

//   //   // Build the URL with parent query parameter
//   //   const baseUrl = `http://${window.location.hostname}:12345/devices/${props.deviceID}/projects`;
//   //   const url = selectedParent && selectedParent !== "all"
//   //     ? `${baseUrl}?parent=${encodeURIComponent(selectedParent)}`
//   //     : baseUrl;

//   //   axios
//   //     .get(url)
//   //     .then((response) => {
//   //       console.log("*************", response.data);
//   //       setProjects(response.data);

//   //       let projectToUse =
//   //         selectedProject || response.data[response.data.length - 1];

//   //       if (selectLastProject === false) {
//   //         console.log("omda testing project", projectID);
//   //         console.log(
//   //           "omda testing project",
//   //           response.data.find((project) => project.id === projectID)
//   //         );
//   //         projectToUse = response.data.find(
//   //           (project) => project.id === projectID
//   //         );
//   //       }

//   //       setProjectData(projectToUse);

//   //       if (projectToUse) {
//   //         console.log("test m7md1", selectedProject);
//   //         console.log("test m7md2", projectToUse);
//   //         setProjectId(projectToUse.id);
//   //         setProjectName(projectToUse.name);
//   //         setInwardDesignPressure(projectToUse.inward_design_pressure);
//   //         setOutwardDesignPressure(projectToUse.outward_design_pressure);

//   //         // Handle parent selection
//   //         if (
//   //           projectToUse.parent_id &&
//   //           parents.find((p) => p.value === projectToUse.parent_id)
//   //         ) {
//   //           setSelectedParent(projectToUse.parent_id);
//   //         } else {
//   //           setSelectedParent("legacy");
//   //         }

//   //         let static_tests_sorted = projectToUse.static_tests.sort(
//   //           (a, b) => a.index - b.index
//   //         );

//   //         let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
//   //           (a, b) => a.index - b.index
//   //         );

//   //         dispatch(
//   //           devicesActions.readCyclicTestsList({
//   //             deviceID: props.deviceID,
//   //             value: cyclic_tests_sorted,
//   //           })
//   //         );

//   //         dispatch(
//   //           devicesActions.readStaticTestsList({
//   //             deviceID: props.deviceID,
//   //             value: static_tests_sorted,
//   //           })
//   //         );

//   //         console.log("checkkkkk", projectToUse.static_tests);

//   //         // Custom logic dispatches
//   //         dispatch(
//   //           devicesActions.setCustomStaticRows({
//   //             deviceID: deviceID,
//   //             rows: projectToUse.static_tests.filter(
//   //               (test) => test.preset === false
//   //             ),
//   //           })
//   //         );

//   //         dispatch(
//   //           devicesActions.setPresetStaticRows({
//   //             deviceID: deviceID,
//   //             rows: projectToUse.static_tests.filter(
//   //               (test) => test.preset === true
//   //             ),
//   //           })
//   //         );

//   //         dispatch(
//   //           devicesActions.setCustomCyclicRows({
//   //             deviceID: deviceID,
//   //             rows: projectToUse.cyclic_tests.filter(
//   //               (test) => test.preset === false
//   //             ),
//   //           })
//   //         );

//   //         dispatch(
//   //           devicesActions.setPresetCyclicRows({
//   //             deviceID: deviceID,
//   //             rows: projectToUse.cyclic_tests.filter(
//   //               (test) => test.preset === true
//   //             ),
//   //           })
//   //         );
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       console.error("There was an error fetching the projects!", error);
//   //     });
//   // };

//   const fetchProjects = (selectedProject = null, selectLastProject = true , parentId = null) => {
//     console.log("selectLastProject = ", selectLastProject);
//     // console.log("selectedParent being sent = ", selectedParent);

//     // Build the base URL without query parameters
//     // const baseUrl = `http://${window.location.hostname}:12345/devices/${props.deviceID}/projects`;
//     const baseUrl = `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`;
//     const url = parentId && parentId !== "legacy"
//       ? `${baseUrl}/?parent_id=${parentId}`
//       : baseUrl;

//     axios
//       // .post(baseUrl, formData, {
//       .get(url, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then((response) => {
//         console.log("*************", response.data);
//         setProjects(response.data);

//         let projectToUse =
//           selectedProject || response.data[response.data.length - 1];

//         if (selectLastProject === false) {
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

//         if (projectToUse) {
//           console.log("test m7md1", selectedProject);
//           console.log("test m7md2", projectToUse);
//           setProjectId(projectToUse.id);
//           setProjectName(projectToUse.name);
//           setInwardDesignPressure(projectToUse.inward_design_pressure);
//           setOutwardDesignPressure(projectToUse.outward_design_pressure);

//           // Handle parent selection
//             if (
//               projectToUse.parent_id &&
//               parents.find((p) => p.id === projectToUse.parent_id)
//             ) {
//               setSelectedParent(projectToUse.parent_id);
//             } else {
//               setSelectedParent("legacy");
//             }

//           let static_tests_sorted = projectToUse.static_tests.sort(
//             (a, b) => a.index - b.index
//           );

//           let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
//             (a, b) => a.index - b.index
//           );

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

//           console.log("checkkkkk", projectToUse.static_tests);

//           // Custom logic dispatches
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
//         }
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the projects!", error);
//       });
// };

//   // Fetch projects when selectedParent changes
//   // useEffect(() => {
//   //   fetchProjects(null, false); // Fetch projects with the current selectedParent
//   // }, [selectedParent]);

//   // useEffect(() => {
//   //   fetchProjects(); // Initial fetch with default "legacy" parent
//   // }, []);

//   // useEffect(() => {
//   //   if (status === "idle") {
//   //     fetchProjects(null, false);
//   //   }
//   // }, [status]);

//     useEffect(() => {
//     if (status === "idle") {
//       fetchProjects(null, true,null);
//     }
//   }, [status]);

//      useEffect(() => {
//     if (status === "idle") {
//       fetchProjects(null, false ,selectedParent);
//     }
//   }, [selectedParent]);

//   const handleNewProjectClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleNewParentClick = () => {
//     setIsAddParentModalOpen(true);
//   };

//   const handleAddParentModalClose = () => {
//     setIsAddParentModalOpen(false);
//   };

// const handleSaveNewProject = () => {
//   if (newProjectName.trim() !== "") {
//     console.log("888888888888888",newParent)
//     axios
//       .post(
//         // `http://${window.location.hostname}:12345/devices/${props.deviceID}/projects/`,
//         `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
//         {
//           name: newProjectName,
//           inward_design_pressure: parseFloat(inwardDesignPressure),
//           outward_design_pressure: parseFloat(outwardDesignPressure),
//           // parent: selectedParent !== "legacy" ? selectedParent : null,
//           // parent: selectedParent,
//           parent_id: newParent,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         // fetchProjects();
//         // const newProject = response.data;
//         // console.log("newProject", newProject);
//         // // ... rest of the code

//         const newProject = response.data;
//         fetchProjects(newProject);
//         console.log("newProject", newProject);
//         setSelectedParent(newProject.parent_id || "legacy");
//       })
//       .catch((error) => {
//         console.error("There was an error creating the new project!", error);
//       })
//       .finally(() => {
//         setNewProjectName("");
//         handleModalClose();
//       });
//   }
// };

// const handleSaveNewParent = () => {
//   if (newParent.trim() !== "") {
//     axios
//       .post(
//         // `http://${window.location.hostname}:12345/devices/${props.deviceID}/parents/`,
//         // `http://${window.location.hostname}:8000/devices/${props.deviceID}/parents/`,
//         `http://${window.location.hostname}:8000/project-parents`,
//         {
//           name: newParent,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         fetchProjects();
//         fetchParents();
//         // const newProject = response.data;
//         // console.log("newProject", newProject);
//         // ... rest of the code
//       })
//       .catch((error) => {
//         console.error("There was an error creating the new project!", error);
//       })
//       .finally(() => {
//         // setNewProjectName("");
//         handleAddParentModalClose();
//       });
//   }
// };

// const handleSaveEditClick = () => {
//   if (isEditable) {
//     axios
//       .put(
//         `http://${window.location.hostname}:8000/projects/${projectID}`,
//         {
//           name: projectName,
//           inward_design_pressure: parseFloat(inwardDesignPressure),
//           outward_design_pressure: parseFloat(outwardDesignPressure),
//           // parent: selectedParent !== "legacy" ? selectedParent : null,
//           // parent: selectedParent,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         console.log("Data saved successfully", response.data);
//         fetchProjects();
//       })
//       .catch((error) => {
//         console.error("Error saving data", error);
//       });
//     setIsEditable(!isEditable);
//   } else {
//     setIsEditable(!isEditable);
//   }
// };

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
//     if (neededDevice.init === true) {
//       setClicked(true);
//     }
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setInwardDesignPressure);
//       setInwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   const HandleNegativeDesignLoad = (e) => {
//     setClicked(true);
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setOutwardDesignPressure);
//       setOutwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   // const HandleProjectName = (e) => {
//   //   const selectedProjectId = parseInt(e.target.value);
//   //   const selectedProject = projects.find(
//   //     (project) => project.id === selectedProjectId
//   //   );

//   //   console.log("selectedProject", selectedProject);
//   //   if (selectedProject) {
//   //     setProjectId(selectedProject.id);
//   //     setProjectName(selectedProject.name);

//   //     // Auto-select parent based on project's parent field
//   //     if (
//   //       selectedProject.parent_id &&
//   //       parents.find((p) => p.id === selectedProject.parent_id)
//   //     ) {
//   //       setSelectedParent(selectedProject.parent_id);
//   //     } else {
//   //       setSelectedParent("legacy");
//   //     }
//   //   }
//   //   fetchProjects(selectedProject);
//   // };

//   const HandleProjectName = (e) => {
//     const selectedProjectId = parseInt(e.target.value);
//     const selectedProject = projects.find(
//       (project) => project.id === selectedProjectId
//     );

//     if (selectedProject) {
//       setProjectId(selectedProject.id);
//       setProjectName(selectedProject.name);

//       // Find parent by id; fallback to "legacy" if not found or null/0.
//       if (
//         selectedProject.parent_id &&
//         parents.find((p) => p.id === selectedProject.parent_id)
//       ) {
//         setSelectedParent(selectedProject.parent_id);
//       } else {
//         setSelectedParent("legacy");
//       }
//     }
//     fetchProjects(selectedProject);
//   };

//   useEffect(() => {
//     console.log("omdaaaaaaaaaaa", projectData);
//     if (projectData !== null) {
//       fetchProjects(projectData);
//     }
//   }, [neededDevice.toggle, neededDevice.notify]);

//   const fetchParents = () => {
//     axios
//       // .get(`http://${window.location.hostname}:12345/parents`)
//       // .get(`http://${window.location.hostname}:8000/parents`)
//       .get(`http://${window.location.hostname}:8000/project-parents`)
//       .then((response) => {
//         console.log("Parents fetched:", response.data);
//         setParents(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the parents!", error);
//         setParents([{ id: 0, name: "Legacy" }]);
//       });
//   };

//   useEffect(() => {
//     fetchParents();
//   }, []);

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
//         parents={parents}
//         selectedParent={selectedParent}
//         setSelectedParent={setSelectedParent}
//         handleNewParentClick = {handleNewParentClick}
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
//         onSave={handleSaveNewProject}
//         newProjectName={newProjectName}
//         setNewProjectName={setNewProjectName}
//         inwardDesignPressure={inwardDesignPressure}
//         setInwardDesignPressure={setInwardDesignPressure}
//         outwardDesignPressure={outwardDesignPressure}
//         setOutwardDesignPressure={setOutwardDesignPressure}
//         newParent = {newParent}
//         setNewParent = {setNewParent}
//         parents = {parents}
//       />

//       <ParentAddModal
//         isOpen = {isAddParentModalOpen}
//         onClose = {handleAddParentModalClose}
//         onSave = {handleSaveNewParent}
//         newParent = {newParent}
//         setNewParent = {setNewParent}
//       />
//     </>
//   );
// };

// export default Information;

// // Information.js
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
// import ParentAddModal from "../Modals/ParentAddModal";

// const Information = (props) => {
//   const dispatch = useDispatch();
//   const ref3 = useRef();
//   const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
//   const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
//   const [projectName, setProjectName] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
//   const [newProjectName, setNewProjectName] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
//   const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
//   const [fullLoadPositive, setfullLoadPositive] = useState(0);
//   const [fullLoadNegative, setfullLoadNegative] = useState(0);
//   const [projectID, setProjectId] = useState(0);
//   const [clicked, setClicked] = useState(false);
//   const [projectData, setProjectData] = useState(null);
//   const [parents, setParents] = useState([]);
//   const [selectedParent, setSelectedParent] = useState("legacy");
//   const [newParent, setNewParent] = useState("legacy");

//   const deviceID = props.deviceID;
//   const devices = useSelector((state) => state.devices["devices"]);
//   const neededDevice = devices.find((device) => device.deviceID === deviceID);
//   let toggle = neededDevice.toggle;
//   let status = neededDevice.status;

//   // Pass fetchProjects to parent (Device) when component mounts
//   useEffect(() => {
//     if (props.setFetchProjects) {
//       props.setFetchProjects(() => fetchProjects);
//     }
//   }, [props.setFetchProjects]);

//   useEffect(() => {
//     props.setProjectId(projectID);
//   }, [projectID]);

//   const fetchProjects = (selectedProject = null, selectLastProject = true, parentId = null) => {
//     console.log("=== FETCH PROJECTS ===");
//     console.log("selectedProject:", selectedProject);
//     console.log("selectLastProject:", selectLastProject);
//     console.log("parentId:", parentId);

//     const baseUrl = `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`;
//     const url = parentId && parentId !== "legacy"
//       ? `${baseUrl}?parent_id=${parentId}`
//       : baseUrl;

//     console.log("API URL:", url);

//     axios
//       .get(url, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then((response) => {
//         console.log("API Response:", response.data);
//         setProjects(response.data);

//         let projectToUse = selectedProject;

//         // If no specific project selected, use the last one or find existing one
//         if (!projectToUse) {
//           if (selectLastProject && response.data.length > 0) {
//             projectToUse = response.data[response.data.length - 1];
//           } else if (!selectLastProject) {
//             projectToUse = response.data.find((project) => project.id === projectID);
//           }
//         }

//         console.log("Project to use:", projectToUse);

//         // If we have a project to use, set all the data
//         if (projectToUse) {
//           setProjectId(projectToUse.id);
//           setProjectName(projectToUse.name);
//           setInwardDesignPressure(projectToUse.inward_design_pressure);
//           setOutwardDesignPressure(projectToUse.outward_design_pressure);
//           setProjectData(projectToUse);

//           // Sort and dispatch tests
//           let static_tests_sorted = projectToUse.static_tests.sort((a, b) => a.index - b.index);
//           let cyclic_tests_sorted = projectToUse.cyclic_tests.sort((a, b) => a.index - b.index);

//           dispatch(devicesActions.readCyclicTestsList({
//             deviceID: props.deviceID,
//             value: cyclic_tests_sorted,
//           }));

//           dispatch(devicesActions.readStaticTestsList({
//             deviceID: props.deviceID,
//             value: static_tests_sorted,
//           }));

//           // Custom logic dispatches
//           dispatch(devicesActions.setCustomStaticRows({
//             deviceID: deviceID,
//             rows: projectToUse.static_tests.filter((test) => test.preset === false),
//           }));

//           dispatch(devicesActions.setPresetStaticRows({
//             deviceID: deviceID,
//             rows: projectToUse.static_tests.filter((test) => test.preset === true),
//           }));

//           dispatch(devicesActions.setCustomCyclicRows({
//             deviceID: deviceID,
//             rows: projectToUse.cyclic_tests.filter((test) => test.preset === false),
//           }));

//           dispatch(devicesActions.setPresetCyclicRows({
//             deviceID: deviceID,
//             rows: projectToUse.cyclic_tests.filter((test) => test.preset === true),
//           }));
//         } else {
//           // No project found, reset everything
//           console.log("No project to use, resetting...");
//           setProjectId(0);
//           setProjectName("");
//           setProjectData(null);
//         }
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the projects!", error);
//         setProjects([]);
//         setProjectId(0);
//         setProjectName("");
//         setProjectData(null);
//       });
//   };

//   // Initial load when component mounts
//   useEffect(() => {
//     if (status === "idle") {
//       console.log("=== INITIAL LOAD ===");
//       fetchProjects(null, true, null);
//     }
//   }, [status]);

//   // Handle parent selection change - filter specimens
//   const handleParentChange = (newParentId) => {
//     console.log("=== PARENT CHANGE ===");
//     console.log("Current selectedParent:", selectedParent);
//     console.log("New parentId:", newParentId);

//     // Update selected parent immediately
//     setSelectedParent(newParentId);

//     // Reset project selection when parent changes
//     setProjectId(0);
//     setProjectName("");
//     setProjectData(null);
//     setInwardDesignPressure(0);
//     setOutwardDesignPressure(0);

//     // Fetch projects for the new parent
//     const filterParentId = newParentId === "legacy" ? null : newParentId;
//     fetchProjects(null, false, filterParentId); // Don't select last project, just get the list
//   };

//   // Handle specimen selection change - auto-update parent
//   const HandleProjectName = (e) => {
//     console.log("=== SPECIMEN CHANGE ===");
//     const selectedProjectId = parseInt(e.target.value);
//     console.log("Selected specimen ID:", selectedProjectId);

//     if (!selectedProjectId) {
//       // User selected "Select a specimen" option
//       setProjectId(0);
//       setProjectName("");
//       setProjectData(null);
//       setInwardDesignPressure(0);
//       setOutwardDesignPressure(0);
//       return;
//     }

//     const selectedProject = projects.find((project) => project.id === selectedProjectId);
//     console.log("Selected project:", selectedProject);

//     if (selectedProject) {
//       setProjectId(selectedProject.id);
//       setProjectName(selectedProject.name);

//       // Auto-update parent based on selected specimen
//       const newParentId = selectedProject.parent_id || "legacy";
//       console.log("Auto-updating parent to:", newParentId);

//       if (newParentId !== selectedParent) {
//         setSelectedParent(newParentId);
//       }

//       // Fetch the selected project data
//       fetchProjects(selectedProject, false, null);
//     }
//   };

//   const handleNewProjectClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleNewParentClick = () => {
//     setIsAddParentModalOpen(true);
//   };

//   const handleAddParentModalClose = () => {
//     setIsAddParentModalOpen(false);
//   };

//   const handleSaveNewProject = () => {
//     if (newProjectName.trim() !== "") {
//       console.log("Creating new project with parent:", newParent);
//       axios
//         .post(
//           `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
//           {
//             name: newProjectName,
//             inward_design_pressure: parseFloat(inwardDesignPressure),
//             outward_design_pressure: parseFloat(outwardDesignPressure),
//             parent_id: newParent === "legacy" ? null : newParent,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           const newProject = response.data;
//           console.log("New project created:", newProject);
//           setSelectedParent(newProject.parent_id || "legacy");
//           fetchProjects(newProject);
//         })
//         .catch((error) => {
//           console.error("There was an error creating the new project!", error);
//         })
//         .finally(() => {
//           setNewProjectName("");
//           handleModalClose();
//         });
//     }
//   };

//   const handleSaveNewParent = () => {
//     if (newParent.trim() !== "") {
//       axios
//         .post(
//           `http://${window.location.hostname}:8000/project-parents`,
//           {
//             name: newParent,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           console.log("New parent created:", response.data);
//           fetchParents();
//           fetchProjects();
//         })
//         .catch((error) => {
//           console.error("There was an error creating the new parent!", error);
//         })
//         .finally(() => {
//           handleAddParentModalClose();
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
//             inward_design_pressure: parseFloat(inwardDesignPressure),
//             outward_design_pressure: parseFloat(outwardDesignPressure),
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           console.log("Data saved successfully", response.data);
//           fetchProjects(null, false, selectedParent === "legacy" ? null : selectedParent);
//         })
//         .catch((error) => {
//           console.error("Error saving data", error);
//         });
//       setIsEditable(!isEditable);
//     } else {
//       setIsEditable(!isEditable);
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
//     if (neededDevice.init === true) {
//       setClicked(true);
//     }
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setInwardDesignPressure);
//       setInwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   const HandleNegativeDesignLoad = (e) => {
//     setClicked(true);
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setOutwardDesignPressure);
//       setOutwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   useEffect(() => {
//     console.log("Device toggle/notify changed, refetching...");
//     if (projectData !== null) {
//       fetchProjects(projectData);
//     }
//   }, [neededDevice.toggle, neededDevice.notify]);

//   const fetchParents = () => {
//     axios
//       .get(`http://${window.location.hostname}:8000/project-parents`)
//       .then((response) => {
//         console.log("Parents fetched:", response.data);
//         setParents(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the parents!", error);
//         setParents([]);
//       });
//   };

//   useEffect(() => {
//     fetchParents();
//   }, []);

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
//         parents={parents}
//         selectedParent={selectedParent}
//         setSelectedParent={setSelectedParent}
//         handleNewParentClick={handleNewParentClick}
//         handleParentChange={handleParentChange}
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
//         onSave={handleSaveNewProject}
//         newProjectName={newProjectName}
//         setNewProjectName={setNewProjectName}
//         inwardDesignPressure={inwardDesignPressure}
//         setInwardDesignPressure={setInwardDesignPressure}
//         outwardDesignPressure={outwardDesignPressure}
//         setOutwardDesignPressure={setOutwardDesignPressure}
//         newParent={newParent}
//         setNewParent={setNewParent}
//         parents={parents}
//       />

//       <ParentAddModal
//         isOpen={isAddParentModalOpen}
//         onClose={handleAddParentModalClose}
//         onSave={handleSaveNewParent}
//         newParent={newParent}
//         setNewParent={setNewParent}
//       />
//     </>
//   );
// };

// export default Information;

// // Information.js
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
// import ParentAddModal from "../Modals/ParentAddModal";

// const Information = (props) => {
//   const dispatch = useDispatch();
//   const ref3 = useRef();
//   const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
//   const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
//   const [projectName, setProjectName] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
//   const [newProjectName, setNewProjectName] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
//   const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
//   const [fullLoadPositive, setfullLoadPositive] = useState(0);
//   const [fullLoadNegative, setfullLoadNegative] = useState(0);
//   const [projectID, setProjectId] = useState(0);
//   const [clicked, setClicked] = useState(false);
//   const [projectData, setProjectData] = useState(null);
//   const [parents, setParents] = useState([]);
//   const [selectedParent, setSelectedParent] = useState(""); // Start with empty/no selection
//   const [newParent, setNewParent] = useState("legacy");

//   const deviceID = props.deviceID;
//   const devices = useSelector((state) => state.devices["devices"]);
//   const neededDevice = devices.find((device) => device.deviceID === deviceID);
//   let toggle = neededDevice.toggle;
//   let status = neededDevice.status;

//   // Pass fetchProjects to parent (Device) when component mounts
//   useEffect(() => {
//     if (props.setFetchProjects) {
//       props.setFetchProjects(() => fetchProjects);
//     }
//   }, [props.setFetchProjects]);

//   useEffect(() => {
//     props.setProjectId(projectID);
//   }, [projectID]);

//   const fetchProjects = (
//     selectedProject = null,
//     selectLastProject = true,
//     parentId = null
//   ) => {
//     console.log("=== FETCH PROJECTS ===");
//     console.log("selectedProject:", selectedProject);
//     console.log("selectLastProject:", selectLastProject);
//     console.log("parentId:", parentId);

//     const baseUrl = `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`;
//     const url =
//       parentId && parentId !== "legacy"
//         ? `${baseUrl}?parent_id=${parentId}`
//         : baseUrl;

//     console.log("API URL:", url);

//     axios
//       .get(url, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         console.log("API Response:", response.data);

//         let filteredProjects = response.data;

//         // If parentId is null (legacy case), filter to show only projects without parent_id
//         console.log("**",parentId)
//         console.log("--",selectedParent)
//         if (parentId === null && selectedParent === "legacy") {
//         console.log("//",parentId)
//           const filteredProjects = projects.filter(project => project.parent_id === null);
//           console.log("Filtered for Legacy (no parent_id):", filteredProjects);
//         }
//         setProjects(filteredProjects);

//         let projectToUse = selectedProject;

//         // If no specific project selected, use the last one or find existing one
//         if (!projectToUse) {
//           if (selectLastProject && filteredProjects.length > 0) {
//             projectToUse = filteredProjects[filteredProjects.length - 1];
//           } else if (!selectLastProject) {
//             projectToUse = filteredProjects.find(
//               (project) => project.id === projectID
//             );
//           }
//         }

//         console.log("Project to use:", projectToUse);

//         // If we have a project to use, set all the data
//         if (projectToUse) {
//           setProjectId(projectToUse.id);
//           setProjectName(projectToUse.name);
//           setInwardDesignPressure(projectToUse.inward_design_pressure);
//           setOutwardDesignPressure(projectToUse.outward_design_pressure);
//           setProjectData(projectToUse);

//           // Sort and dispatch tests
//           let static_tests_sorted = projectToUse.static_tests.sort(
//             (a, b) => a.index - b.index
//           );
//           let cyclic_tests_sorted = projectToUse.cyclic_tests.sort(
//             (a, b) => a.index - b.index
//           );

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

//           // Custom logic dispatches
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
//         } else {
//           // No project found, reset everything
//           console.log("No project to use, resetting...");
//           setProjectId(0);
//           setProjectName("");
//           setProjectData(null);
//           setInwardDesignPressure(0);
//           setOutwardDesignPressure(0);
//         }
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the projects!", error);
//         setProjects([]);
//         setProjectId(0);
//         setProjectName("");
//         setProjectData(null);
//         setInwardDesignPressure(0);
//         setOutwardDesignPressure(0);
//       });
//   };

//   // Remove initial load - only fetch when parent is selected
//   // useEffect(() => {
//   //   if (status === "idle") {
//   //     console.log("=== INITIAL LOAD ===");
//   //     fetchProjects(null, true, null);
//   //   }
//   // }, [status]);

//   // Handle parent selection change - filter specimens
//   const handleParentChange = (newParentId) => {
//     console.log("=== PARENT CHANGE ===");
//     console.log("Current selectedParent:", selectedParent);
//     console.log("New parentId:", newParentId);

//     // Update selected parent immediately
//     setSelectedParent(newParentId);

//     // Reset project selection when parent changes
//     setProjectId(0);
//     setProjectName("");
//     setProjectData(null);
//     setInwardDesignPressure(0);
//     setOutwardDesignPressure(0);

//     // Fetch projects for the new parent
//     const filterParentId = newParentId === "legacy" ? null : newParentId;
//     fetchProjects(null, false, filterParentId); // Don't select last project, just get the list
//   };

//   // Handle specimen selection change - DO NOT auto-update parent
//   const HandleProjectName = (e) => {
//     console.log("=== SPECIMEN CHANGE ===");
//     const selectedProjectId = parseInt(e.target.value);
//     console.log("Selected specimen ID:", selectedProjectId);

//     if (!selectedProjectId) {
//       // User selected "Select a specimen" option
//       setProjectId(0);
//       setProjectName("");
//       setProjectData(null);
//       setInwardDesignPressure(0);
//       setOutwardDesignPressure(0);
//       return;
//     }

//     const selectedProject = projects.find(
//       (project) => project.id === selectedProjectId
//     );
//     console.log("Selected project:", selectedProject);

//     if (selectedProject) {
//       setProjectId(selectedProject.id);
//       setProjectName(selectedProject.name);

//       // DO NOT auto-update parent - keep current parent selection
//       console.log("Keeping current parent:", selectedParent);

//       // Fetch the selected project data
//       fetchProjects(selectedProject, false, null);
//     }
//   };

//   const handleNewProjectClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleNewParentClick = () => {
//     setIsAddParentModalOpen(true);
//   };

//   const handleAddParentModalClose = () => {
//     setIsAddParentModalOpen(false);
//   };

//   const handleSaveNewProject = () => {
//     if (newProjectName.trim() !== "") {
//       console.log("Creating new project with parent:", newParent);
//       axios
//         .post(
//           `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
//           {
//             name: newProjectName,
//             inward_design_pressure: parseFloat(inwardDesignPressure),
//             outward_design_pressure: parseFloat(outwardDesignPressure),
//             parent_id: newParent === "legacy" ? null : newParent,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           const newProject = response.data;
//           console.log("New project created:", newProject);
//           setSelectedParent(newProject.parent_id || "legacy");
//           fetchProjects(newProject);
//         })
//         .catch((error) => {
//           console.error("There was an error creating the new project!", error);
//         })
//         .finally(() => {
//           setNewProjectName("");
//           handleModalClose();
//         });
//     }
//   };

//   const handleSaveNewParent = () => {
//     if (newParent.trim() !== "") {
//       axios
//         .post(
//           `http://${window.location.hostname}:8000/project-parents`,
//           {
//             name: newParent,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           console.log("New parent created:", response.data);
//           fetchParents();
//           fetchProjects();
//         })
//         .catch((error) => {
//           console.error("There was an error creating the new parent!", error);
//         })
//         .finally(() => {
//           handleAddParentModalClose();
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
//             inward_design_pressure: parseFloat(inwardDesignPressure),
//             outward_design_pressure: parseFloat(outwardDesignPressure),
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           console.log("Data saved successfully", response.data);
//           fetchProjects(
//             null,
//             false,
//             selectedParent === "legacy" ? null : selectedParent
//           );
//         })
//         .catch((error) => {
//           console.error("Error saving data", error);
//         });
//       setIsEditable(!isEditable);
//     } else {
//       setIsEditable(!isEditable);
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
//     if (neededDevice.init === true) {
//       setClicked(true);
//     }
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setInwardDesignPressure);
//       setInwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   const HandleNegativeDesignLoad = (e) => {
//     setClicked(true);
//     const inputValue = e.target.value;
//     if (/^-?\d*\.?\d*$/.test(inputValue)) {
//       const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
//       validateInput(parsedValue, setOutwardDesignPressure);
//       setOutwardDesignPressure(parsedValue);
//       updateTable();
//     }
//   };

//   useEffect(() => {
//     console.log("Device toggle/notify changed, refetching...");
//     if (projectData !== null) {
//       fetchProjects(projectData);
//     }
//   }, [neededDevice.toggle, neededDevice.notify]);

//   const fetchParents = () => {
//     axios
//       .get(`http://${window.location.hostname}:8000/project-parents`)
//       .then((response) => {
//         console.log("Parents fetched:", response.data);
//         setParents(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the parents!", error);
//         setParents([]);
//       });
//   };

//   useEffect(() => {
//     fetchParents();
//   }, []);

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
//         parents={parents}
//         selectedParent={selectedParent}
//         setSelectedParent={setSelectedParent}
//         handleNewParentClick={handleNewParentClick}
//         handleParentChange={handleParentChange}
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
//         onSave={handleSaveNewProject}
//         newProjectName={newProjectName}
//         setNewProjectName={setNewProjectName}
//         inwardDesignPressure={inwardDesignPressure}
//         setInwardDesignPressure={setInwardDesignPressure}
//         outwardDesignPressure={outwardDesignPressure}
//         setOutwardDesignPressure={setOutwardDesignPressure}
//         newParent={newParent}
//         setNewParent={setNewParent}
//         parents={parents}
//       />

//       <ParentAddModal
//         isOpen={isAddParentModalOpen}
//         onClose={handleAddParentModalClose}
//         onSave={handleSaveNewParent}
//         newParent={newParent}
//         setNewParent={setNewParent}
//       />
//     </>
//   );
// };

// export default Information;

// Information.js - Fixed version
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
import ParentAddModal from "../Modals/ParentAddModal";

const Information = (props) => {
  const dispatch = useDispatch();
  const ref3 = useRef();
  const [positiveDesignLoad, setPositiveDesignLoad] = useState(0);
  const [negativeDesignLoad, setNegativeDesignLoad] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [inwardDesignPressure, setInwardDesignPressure] = useState(0);
  const [outwardDesignPressure, setOutwardDesignPressure] = useState(0);
  const [fullLoadPositive, setfullLoadPositive] = useState(0);
  const [fullLoadNegative, setfullLoadNegative] = useState(0);
  const [projectID, setProjectId] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState("legacy"); // Default to legacy
  const [newParent, setNewParent] = useState("legacy");
  const [hasWaterInfiltration, setHasWaterInfiltration] = useState(false);
  const [tableKey, setTableKey] = useState(0); // Key to force table re-render

  const deviceID = props.deviceID;
  const devices = useSelector((state) => state.devices["devices"]);
  const neededDevice = devices.find((device) => device.deviceID === deviceID);
  let toggle = neededDevice.toggle;
  let status = neededDevice.status;

  // Pass fetchProjects to parent (Device) when component mounts
  useEffect(() => {
    if (props.setFetchProjects) {
      props.setFetchProjects(() => fetchProjects);
    }
  }, [props.setFetchProjects]);

  useEffect(() => {
    props.setProjectId(projectID);
  }, [projectID]);

  // const fetchProjects = (
  //   selectedProject = null,
  //   selectLastProject = true,
  //   parentId = null
  // ) => {
  //   console.log("=== FETCH PROJECTS ===");
  //   console.log("selectedProject:", selectedProject);
  //   console.log("selectLastProject:", selectLastProject);
  //   console.log("parentId:", parentId);

  //   // Use the current selectedParent if parentId is not explicitly provided
  //   const actualParentId = parentId !== null ? parentId : selectedParent;
  //   console.log("actualParentId:", actualParentId);

  //   const baseUrl = `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`;

  //   // Always fetch all projects first, then filter on frontend
  //   const url = baseUrl;
  //   console.log("API URL:", url);

  //   axios
  //     .get(url, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       console.log("API Response:", response.data);

  //       let allProjects = response.data;
  //       let filteredProjects = [];

  //       // Filter projects based on parent selection
  //       if (actualParentId === "legacy") {
  //         // For legacy, show only projects without parent_id (null or undefined)
  //         filteredProjects = allProjects.filter(project =>
  //           project.parent_id === null || project.parent_id === undefined
  //         );
  //         console.log("Filtered for Legacy (no parent_id):", filteredProjects);
  //       } else {
  //         // For specific parent, show only projects with matching parent_id
  //         filteredProjects = allProjects.filter(project =>
  //           project.parent_id === actualParentId
  //         );
  //         console.log(`Filtered for parent ${actualParentId}:`, filteredProjects);
  //       }

  //       setProjects(filteredProjects);

  //       let projectToUse = selectedProject;

  //       // If no specific project selected, use the last one or find existing one
  //       if (!projectToUse) {
  //         if (selectLastProject && filteredProjects.length > 0) {
  //           projectToUse = filteredProjects[filteredProjects.length - 1];
  //         } else if (!selectLastProject) {
  //           projectToUse = filteredProjects.find(
  //             (project) => project.id === projectID
  //           );
  //         }
  //       }

  //       console.log("Project to use:", projectToUse);

  //       // If we have a project to use, set all the data
  //       if (projectToUse) {
  //         setProjectId(projectToUse.id);
  //         setProjectName(projectToUse.name);
  //         setInwardDesignPressure(projectToUse.inward_design_pressure);
  //         setOutwardDesignPressure(projectToUse.outward_design_pressure);
  //         setProjectData(projectToUse);

  //         // Sort and dispatch tests
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
  //       } else {
  //         // No project found, reset everything
  //         console.log("No project to use, resetting...");
  //         setProjectId(0);
  //         setProjectName("");
  //         setProjectData(null);
  //         setInwardDesignPressure(0);
  //         setOutwardDesignPressure(0);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the projects!", error);
  //       setProjects([]);
  //       setProjectId(0);
  //       setProjectName("");
  //       setProjectData(null);
  //       setInwardDesignPressure(0);
  //       setOutwardDesignPressure(0);
  //     });
  // };

  const fetchProjects = (
    selectedProject = null,
    selectLastProject = true,
    parentId = null
  ) => {
    console.log("=== FETCH PROJECTS ===");
    console.log("selectedProject:", selectedProject);
    console.log("selectLastProject:", selectLastProject);
    console.log("parentId:", parentId);
    console.log("current selectedParent:", selectedParent);
    console.log("current projectID:", projectID);
    console.log("current projectName:", projectName);

    // Resolve the effective parent (null for legacy)
    // 1) Work out the effective parent (unchanged)
    const actualParentId = parentId !== null ? parentId : selectedParent;
    console.log("actualParentId:", actualParentId);
    const baseUrl = `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects`;

    // 2) NEW: build the URL conditionally
    const isLegacy = actualParentId === "legacy";
    const url = isLegacy ? baseUrl : `${baseUrl}?parent_id=${actualParentId}`;
    console.log("API URL:", url);
    console.log("isLegacy:", isLegacy);

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);

        // 3) NEW: only frontend-filter for legacy; otherwise use response as-is
        console.log("Raw API response projects:", response.data.map(p => ({id: p.id, name: p.name, parent_id: p.parent_id})));
        
        const filteredProjects = isLegacy
          ? response.data.filter(
              (p) => p.parent_id === null || p.parent_id === undefined
            )
          : response.data;

        console.log("Filtered projects:", filteredProjects.map(p => ({id: p.id, name: p.name, parent_id: p.parent_id})));
        setProjects(filteredProjects);

        let projectToUse = selectedProject;

        // If no specific project selected, use the last one or find existing one
        if (!projectToUse) {
          if (selectLastProject && filteredProjects.length > 0) {
            projectToUse = filteredProjects[filteredProjects.length - 1];
            console.log("Selected last project:", projectToUse);
          } else if (!selectLastProject) {
            console.log("Looking for project with ID:", projectID);
            console.log("Available projects:", filteredProjects.map(p => ({id: p.id, name: p.name, parent_id: p.parent_id})));
            projectToUse = filteredProjects.find(
              (project) => project.id === projectID
            );
            console.log("Found project:", projectToUse);
          }
        }

        console.log("Project to use:", projectToUse);

        if (projectToUse) {
          setProjectId(projectToUse.id);
          setProjectName(projectToUse.name);
          setInwardDesignPressure(projectToUse.inward_design_pressure);
          setOutwardDesignPressure(projectToUse.outward_design_pressure);
          setProjectData(projectToUse);

          // sort/dispatch unchanged...
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
          dispatch(
            devicesActions.setCustomStaticRows({
              deviceID,
              rows: projectToUse.static_tests.filter((t) => t.preset === false),
            })
          );
          dispatch(
            devicesActions.setPresetStaticRows({
              deviceID,
              rows: projectToUse.static_tests.filter((t) => t.preset === true),
            })
          );
          dispatch(
            devicesActions.setCustomCyclicRows({
              deviceID,
              rows: projectToUse.cyclic_tests.filter((t) => t.preset === false),
            })
          );
          dispatch(
            devicesActions.setPresetCyclicRows({
              deviceID,
              rows: projectToUse.cyclic_tests.filter((t) => t.preset === true),
            })
          );
          
          // Debug: Log the test data to see if it's being updated
          console.log("=== TEST DATA UPDATED ===");
          console.log("Static tests:", projectToUse.static_tests);
          console.log("Cyclic tests:", projectToUse.cyclic_tests);
          console.log("Preset cyclic tests:", projectToUse.cyclic_tests.filter((t) => t.preset === true));
          
          // Debug: Check if any tests are marked as finished
          const finishedTests = projectToUse.cyclic_tests.filter((t) => t.finished === true);
          console.log("Finished tests:", finishedTests);
          console.log("Total cyclic tests:", projectToUse.cyclic_tests.length);
          console.log("Finished count:", finishedTests.length);
          
          // Force table re-render to show updated test status
          setTableKey(prev => prev + 1);
        } else {
          // reset unchanged...
          console.log("No project to use, resetting...");
          setProjectId(0);
          setProjectName("");
          setProjectData(null);
          setInwardDesignPressure(0);
          setOutwardDesignPressure(0);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the projects!", error);
        setProjects([]);
        setProjectId(0);
        setProjectName("");
        setProjectData(null);
        setInwardDesignPressure(0);
        setOutwardDesignPressure(0);
      }
    );
  };

  // Initial load when component mounts and status is ready
  useEffect(() => {
    if (status === "idle") {
      console.log("=== STATUS CHANGED TO IDLE ===");
      console.log("Current projectID:", projectID);
      console.log("Current projectName:", projectName);
      console.log("Current selectedParent:", selectedParent);
      
      // Only select last project on initial load, not when status changes to idle after test completion
      const isInitialLoad = projectID === 0 && projectName === "";
      console.log("Is initial load:", isInitialLoad);
      
      if (isInitialLoad) {
        // Initial load - select last project
        fetchProjects(
          null,
          true, // Select last project
          selectedParent === "legacy" ? null : selectedParent
        );
      } else {
        // Test completion - preserve current project selection
        console.log("Test completed, preserving current project selection");
        // Don't refetch projects, just keep current selection
        // The project data should already be loaded and current
      }
    }
  }, [status, selectedParent]);

  // Handle parent selection change - filter specimens
  const handleParentChange = (newParentId) => {
    console.log("=== PARENT CHANGE ===");
    console.log("Current selectedParent:", selectedParent);
    console.log("New parentId:", newParentId);

    // Update selected parent immediately
    setSelectedParent(newParentId);

    // Reset project selection when parent changes
    setProjectId(0);
    setProjectName("");
    setProjectData(null);
    setInwardDesignPressure(0);
    setOutwardDesignPressure(0);

    // Fetch projects for the new parent
    const filterParentId = newParentId === "legacy" ? null : newParentId;
    fetchProjects(null, false, filterParentId); // Don't select last project, just get the list
  };

  // Handle specimen selection change - DO NOT auto-update parent
  const HandleProjectName = (e) => {
    console.log("=== SPECIMEN CHANGE ===");
    const selectedProjectId = parseInt(e.target.value);
    console.log("Selected specimen ID:", selectedProjectId);

    if (!selectedProjectId) {
      // User selected "Select a specimen" option
      setProjectId(0);
      setProjectName("");
      setProjectData(null);
      setInwardDesignPressure(0);
      setOutwardDesignPressure(0);
      return;
    }

    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    console.log("Selected project:", selectedProject);

    if (selectedProject) {
      setProjectId(selectedProject.id);
      setProjectName(selectedProject.name);

      // DO NOT auto-update parent - keep current parent selection
      console.log("Keeping current parent:", selectedParent);

      // Fetch the selected project data
      fetchProjects(
        selectedProject,
        false,
        selectedParent === "legacy" ? null : selectedParent
      );
    }
  };

  const handleNewProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNewParentClick = () => {
    setIsAddParentModalOpen(true);
  };

  const handleAddParentModalClose = () => {
    setIsAddParentModalOpen(false);
  };

  const handleSaveNewProject = () => {
    if (newProjectName.trim() !== "") {
      console.log("Creating new project with parent:", newParent);
      axios
        .post(
          `http://${window.location.hostname}:8000/devices/${props.deviceID}/projects/`,
          {
            name: newProjectName,
            inward_design_pressure: parseFloat(inwardDesignPressure),
            outward_design_pressure: parseFloat(outwardDesignPressure),
            parent_id: newParent === "legacy" ? null : newParent,
            has_water_infiltration: hasWaterInfiltration,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const newProject = response.data;
          console.log("New project created:", newProject);
          const newProjectParentId = newProject.parent_id || "legacy";
          setSelectedParent(newProjectParentId);
          fetchProjects(newProject, false, newProject.parent_id);
        })
        .catch((error) => {
          console.error("There was an error creating the new project!", error);
        })
        .finally(() => {
          setNewProjectName("");
          handleModalClose();
        });
    }
  };

  const handleSaveNewParent = () => {
    if (newParent.trim() !== "") {
      axios
        .post(
          `http://${window.location.hostname}:8000/project-parents`,
          {
            name: newParent,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("New parent created:", response.data);
          fetchParents();
          fetchProjects(
            null,
            false,
            selectedParent === "legacy" ? null : selectedParent
          );
        })
        .catch((error) => {
          console.error("There was an error creating the new parent!", error);
        })
        .finally(() => {
          handleAddParentModalClose();
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
            inward_design_pressure: parseFloat(inwardDesignPressure),
            outward_design_pressure: parseFloat(outwardDesignPressure),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Data saved successfully", response.data);
          fetchProjects(
            null,
            false,
            selectedParent === "legacy" ? null : selectedParent
          );
        })
        .catch((error) => {
          console.error("Error saving data", error);
        });
      setIsEditable(!isEditable);
    } else {
      setIsEditable(!isEditable);
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
    if (neededDevice.init === true) {
      setClicked(true);
    }
    const inputValue = e.target.value;
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
      validateInput(parsedValue, setInwardDesignPressure);
      setInwardDesignPressure(parsedValue);
      updateTable();
    }
  };

  const HandleNegativeDesignLoad = (e) => {
    setClicked(true);
    const inputValue = e.target.value;
    if (/^-?\d*\.?\d*$/.test(inputValue)) {
      const parsedValue = inputValue === "" ? "" : parseFloat(inputValue);
      validateInput(parsedValue, setOutwardDesignPressure);
      setOutwardDesignPressure(parsedValue);
      updateTable();
    }
  };

  useEffect(() => {
    console.log("Device toggle/notify changed, refetching...");
    if (projectData !== null) {
      // Add a small delay to ensure the server has processed the test finish request
      // before fetching fresh data from server
      setTimeout(() => {
        console.log("Fetching fresh data after delay...");
        fetchProjects(null, false, selectedParent === "legacy" ? null : selectedParent);
      }, 500); // 500ms delay
    }
  }, [neededDevice.toggle, neededDevice.notify]);

  const fetchParents = () => {
    axios
      .get(`http://${window.location.hostname}:8000/project-parents`)
      .then((response) => {
        console.log("Parents fetched:", response.data);
        setParents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the parents!", error);
        setParents([]);
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
        handleNewParentClick={handleNewParentClick}
        handleParentChange={handleParentChange}
      />

      <CyclicStaticPressureTable
        key={`table-${projectID}-${tableKey}-${neededDevice.presetStaticRows?.map(r => r.finished).join(',')}-${neededDevice.presetCyclicRows?.map(r => r.finished).join(',')}`} // Force re-render when test data changes
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
        selectedParent={selectedParent}
      />

      <ProjectModalInwardOutward
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveNewProject}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        inwardDesignPressure={inwardDesignPressure}
        setInwardDesignPressure={setInwardDesignPressure}
        outwardDesignPressure={outwardDesignPressure}
        setOutwardDesignPressure={setOutwardDesignPressure}
        newParent={newParent}
        setNewParent={setNewParent}
        parents={parents}
        hasWaterInfiltration={hasWaterInfiltration}
        setHasWaterInfiltration={setHasWaterInfiltration}
      />

      <ParentAddModal
        isOpen={isAddParentModalOpen}
        onClose={handleAddParentModalClose}
        onSave={handleSaveNewParent}
        newParent={newParent}
        setNewParent={setNewParent}
      />
    </>
  );
};

export default Information;
