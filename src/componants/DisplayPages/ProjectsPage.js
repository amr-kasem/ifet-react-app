// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import styles from "./ProjectsPage.module.css";

// export default function ProjectsPage() {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deviceFilter, setDeviceFilter] = useState("");
//   const [projectFilter, setProjectFilter] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const testCategory = location.state?.testCategory || null;

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get(
//           `http://${window.location.hostname}:8000/devices/`
//         );
//         setDevices(response.data);
//       } catch (error) {
//         console.error("Error fetching devices:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // Transform data to project-level view
//   const projectRows = useMemo(() => {
//     if (!devices || devices.length === 0) return [];
//     const projectMap = new Map();

//     devices.forEach((device) => {
//       console.log("### device = ", device)
//       const projects = device.projects || [];
//       projects.forEach((project) => {
//         const key = `${device.name}-${project.name}`;
//         if (!projectMap.has(key)) {
//           const staticTests = project.static_tests || [];
//           const cyclicTests = project.cyclic_tests || [];
//           let totalTests = staticTests.length + cyclicTests.length;
//           let completedTests = [...staticTests, ...cyclicTests].filter(
//             (test) => test.finished
//           ).length;

//           // Filter by category if selected
//           if (testCategory === "static") {
//             totalTests = staticTests.length;
//             completedTests = staticTests.filter((test) => test.finished).length;
//           } else if (testCategory === "cyclic") {
//             totalTests = cyclicTests.length;
//             completedTests = cyclicTests.filter((test) => test.finished).length;
//           }

//           projectMap.set(key, {
//             deviceName: device.name,
//             projectName: project.name,
//             totalTests,
//             completedTests,
//             staticTestsCount: staticTests.length,
//             cyclicTestsCount: cyclicTests.length,
//             projectData: project,
//           });
//         }
//       });
//     });

//     return Array.from(projectMap.values());
//   }, [devices, testCategory]);

//   // Filter projects
//   const filteredProjects = projectRows.filter(
//     (row) =>
//       (deviceFilter === "" || row.deviceName === deviceFilter) &&
//       (projectFilter === "" ||
//         row.projectName.toLowerCase().includes(projectFilter.toLowerCase()))
//   );

//   // Get unique device names for filter
//   const deviceNames = [...new Set(projectRows.map((r) => r.deviceName))];

//   const handleProjectClick = (project) => {
//     navigate(
//       `/projects/${encodeURIComponent(project.projectName)}/tests/select-type`,
//       {
//         state: {
//           projectData: project.projectData,
//           deviceName: project.deviceName,
//           projectName: project.projectName,
//         },
//       }
//     );
//   };

//   if (loading) return <div className={styles.container}>Loading data...</div>;

//   return (
//     <div className={styles.container}>
//       <button className={styles.button} onClick={() => navigate("/")}>
//         Back
//       </button>

//       <h2 className={styles.heading}>Specimens Overview</h2>

//       {/* Filter Controls */}
//       <div className={styles.filters}>
//         <div>
//           <label className={styles.filterLabel}>Device</label>
//           <select
//             className={styles.filterSelect}
//             value={deviceFilter}
//             onChange={(e) => setDeviceFilter(e.target.value)}
//           >
//             <option value="">All Devices</option>
//             {deviceNames.map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className={styles.filterLabel}>Project Name</label>
//           <input
//             type="text"
//             className={styles.filterSelect}
//             placeholder="Type to search projects..."
//             value={projectFilter}
//             onChange={(e) => setProjectFilter(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Projects Table */}
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Device</th>
//               <th>Project Name</th>
//               <th>Total Tests</th>
//               <th>Completed Tests</th>
//               <th>Static Tests</th>
//               <th>Cyclic Tests</th>
//               <th>Progress</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjects.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className={styles.noData}>
//                   No matching projects found
//                 </td>
//               </tr>
//             ) : (
//               filteredProjects.map((project, index) => (
//                 <tr
//                   key={index}
//                   onClick={() => handleProjectClick(project)}
//                   style={{ cursor: "pointer" }}
//                   className={styles.clickableRow}
//                 >
//                   <td>{project.deviceName}</td>
//                   <td>
//                     <strong>{project.projectName}</strong>
//                   </td>
//                   <td>{project.totalTests}</td>
//                   <td>{project.completedTests}</td>
//                   <td>{project.staticTestsCount}</td>
//                   <td>{project.cyclicTestsCount}</td>
//                   <td>
//                     {project.totalTests > 0
//                       ? `${Math.round(
//                           (project.completedTests / project.totalTests) * 100
//                         )}%`
//                       : "0%"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import styles from "./ProjectsPage.module.css";

// export default function ProjectsPage() {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deviceFilter, setDeviceFilter] = useState("");
//   const [projectFilter, setProjectFilter] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = useParams();
//   const testCategory = location.state?.testCategory || null;

//   // Extract route parameters for hierarchical navigation
//   const { deviceName: routeDeviceName, parentName: routeParentName } = params;

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get(
//           `http://${window.location.hostname}:8000/devices/`
//         );
//         setDevices(response.data);
//       } catch (error) {
//         console.error("Error fetching devices:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // Transform data to project-level view
//   const projectRows = useMemo(() => {
//     if (!devices || devices.length === 0) return [];
//     const projectMap = new Map();

//     devices.forEach((device) => {
//       // If we're in hierarchical mode, filter by device name
//       if (routeDeviceName && device.name !== decodeURIComponent(routeDeviceName)) {
//         return;
//       }

//       const projects = device.projects || [];
//       projects.forEach((project) => {
//         // If we're in hierarchical mode, filter by parent name
//         if (routeParentName) {
//           const projectParent = project.parent_id || "Legacy";
//           if (projectParent !== decodeURIComponent(routeParentName)) {
//             return;
//           }
//         }

//         const key = `${device.name}-${project.name}`;
//         if (!projectMap.has(key)) {
//           const staticTests = project.static_tests || [];
//           const cyclicTests = project.cyclic_tests || [];
//           let totalTests = staticTests.length + cyclicTests.length;
//           let completedTests = [...staticTests, ...cyclicTests].filter(
//             (test) => test.finished
//           ).length;

//           // Filter by category if selected
//           if (testCategory === "static") {
//             totalTests = staticTests.length;
//             completedTests = staticTests.filter((test) => test.finished).length;
//           } else if (testCategory === "cyclic") {
//             totalTests = cyclicTests.length;
//             completedTests = cyclicTests.filter((test) => test.finished).length;
//           }

//           projectMap.set(key, {
//             deviceName: device.name,
//             projectName: project.name,
//             parentName: project.parent_id || "Legacy",
//             totalTests,
//             completedTests,
//             staticTestsCount: staticTests.length,
//             cyclicTestsCount: cyclicTests.length,
//             projectData: project,
//           });
//         }
//       });
//     });

//     return Array.from(projectMap.values());
//   }, [devices, testCategory, routeDeviceName, routeParentName]);

//   // Filter projects
//   const filteredProjects = projectRows.filter(
//     (row) =>
//       (deviceFilter === "" || row.deviceName === deviceFilter) &&
//       (projectFilter === "" ||
//         row.projectName.toLowerCase().includes(projectFilter.toLowerCase()))
//   );

//   // Get unique device names for filter
//   const deviceNames = [...new Set(projectRows.map((r) => r.deviceName))];

//   const handleProjectClick = (project) => {
//     navigate(
//       `/projects/${encodeURIComponent(project.projectName)}/tests/select-type`,
//       {
//         state: {
//           projectData: project.projectData,
//           deviceName: project.deviceName,
//           projectName: project.projectName,
//         },
//       }
//     );
//   };

//   const handleBackClick = () => {
//     if (routeDeviceName && routeParentName) {
//       // If we're in hierarchical mode, go back to project parents for this device
//       navigate(`/devices/${encodeURIComponent(routeDeviceName)}/parents`);
//     } else {
//       // If we're in "All Projects" mode, go back to devices
//       navigate("/devices");
//     }
//   };

//   // Determine page title and context
//   const getPageTitle = () => {
//     if (routeDeviceName && routeParentName) {
//       // return `Specimens: ${decodeURIComponent(routeDeviceName)} - ${decodeURIComponent(routeParentName)}`;
//       return `Specimens for Project: ${decodeURIComponent(routeParentName)}`;
//     } else {
//       return "All Projects Overview";
//     }
//   };

//   if (loading) return <div className={styles.container}>Loading data...</div>;

//   return (
//     <div className={styles.container}>
//       <button className={styles.button} onClick={handleBackClick}>
//         Back
//       </button>

//       <h2 className={styles.heading}>{getPageTitle()}</h2>

//       {/* Filter Controls - Only show device filter if not in hierarchical mode */}
//       <div className={styles.filters}>
//         {!routeDeviceName && (
//           <div>
//             <label className={styles.filterLabel}>Device</label>
//             <select
//               className={styles.filterSelect}
//               value={deviceFilter}
//               onChange={(e) => setDeviceFilter(e.target.value)}
//             >
//               <option value="">All Devices</option>
//               {deviceNames.map((name) => (
//                 <option key={name} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div>
//           <label className={styles.filterLabel}>Project Name</label>
//           <input
//             type="text"
//             className={styles.filterSelect}
//             placeholder="Type to search projects..."
//             value={projectFilter}
//             onChange={(e) => setProjectFilter(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Projects Table */}
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               {!routeDeviceName && <th>Device</th>}
//               {!routeParentName && <th>Parent</th>}
//               <th>Project Name</th>
//               <th>Total Tests</th>
//               <th>Completed Tests</th>
//               <th>Static Tests</th>
//               <th>Cyclic Tests</th>
//               <th>Progress</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjects.length === 0 ? (
//               <tr>
//                 <td colSpan={routeDeviceName && routeParentName ? "6" : "8"} className={styles.noData}>
//                   No matching projects found
//                 </td>
//               </tr>
//             ) : (
//               filteredProjects.map((project, index) => (
//                 <tr
//                   key={index}
//                   onClick={() => handleProjectClick(project)}
//                   style={{ cursor: "pointer" }}
//                   className={styles.clickableRow}
//                 >
//                   {!routeDeviceName && <td>{project.deviceName}</td>}
//                   {!routeParentName && <td>{project.parentName}</td>}
//                   <td>
//                     <strong>{project.projectName}</strong>
//                   </td>
//                   <td>{project.totalTests}</td>
//                   <td>{project.completedTests}</td>
//                   <td>{project.staticTestsCount}</td>
//                   <td>{project.cyclicTestsCount}</td>
//                   <td>
//                     {project.totalTests > 0
//                       ? `${Math.round(
//                           (project.completedTests / project.totalTests) * 100
//                         )}%`
//                       : "0%"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const testCategory = location.state?.testCategory || null;

  // 👇 pulled from state (sent by ProjectsParentsPage)
  const projectsFromState = location.state?.projects || [];
  const parentIdFromState = location.state?.parentId ?? undefined;
  const parentNameFromState = location.state?.parentName || undefined;

  // route params
  const { deviceName: routeDeviceName, parentName: routeParentName } = params;
  const decodedDeviceName = routeDeviceName ? decodeURIComponent(routeDeviceName) : "";
  const decodedParentName = parentNameFromState || (routeParentName ? decodeURIComponent(routeParentName) : "");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://${window.location.hostname}:8000/devices/`
        );
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ---------- SOURCE OF TRUTH FOR THIS PAGE ----------
  // If we're in hierarchical mode AND we have projects passed via state,
  // use them directly. Otherwise, fall back to building from devices.
  const isHierarchical = !!(routeDeviceName && routeParentName);
  const useStateProjects = isHierarchical && projectsFromState.length > 0;
  // ---------------------------------------------------

  const projectRows = useMemo(() => {
    // A) Use projects passed from state (most reliable & fixes "omda" immediately)
    if (useStateProjects) {
      return projectsFromState.map((project) => {
        const staticTests = project.static_tests || [];
        const cyclicTests = project.cyclic_tests || [];

        let totalTests = staticTests.length + cyclicTests.length;
        let completedTests = [...staticTests, ...cyclicTests].filter(t => t.finished).length;

        if (testCategory === "static") {
          totalTests = staticTests.length;
          completedTests = staticTests.filter(t => t.finished).length;
        } else if (testCategory === "cyclic") {
          totalTests = cyclicTests.length;
          completedTests = cyclicTests.filter(t => t.finished).length;
        }

        return {
          deviceName: decodedDeviceName,
          projectName: project.name,
          // show human name; do NOT try to resolve again here
          parentName: decodedParentName || (project.parent_name || "Legacy"),
          totalTests,
          completedTests,
          staticTestsCount: staticTests.length,
          cyclicTestsCount: cyclicTests.length,
          projectData: project,
        };
      });
    }

    // B) Fallback: build from /devices (for refresh/deep-link without state)
    if (!devices || devices.length === 0) return [];
    const projectMap = new Map();

    devices.forEach((device) => {
      // If hierarchical, filter by device name
      if (routeDeviceName && String(device.name) !== String(decodedDeviceName)) return;

      const projects = device.projects || [];
      projects.forEach((project) => {
        // If hierarchical, try to filter by parent when possible
        if (routeParentName) {
          // Prefer ID passed via state (if present)
          if (parentIdFromState !== undefined) {
            if (parentIdFromState === null && project.parent_id != null) return; // Legacy case
            if (parentIdFromState !== null && String(project.parent_id) !== String(parentIdFromState)) return;
          } else {
            // If you store names on projects later, you can fallback to name check here
            // For now we skip name comparison to avoid mismatches like "omda" vs parent_id
          }
        }

        const key = `${device.name}-${project.name}`;
        if (!projectMap.has(key)) {
          const staticTests = project.static_tests || [];
          const cyclicTests = project.cyclic_tests || [];
          let totalTests = staticTests.length + cyclicTests.length;
          let completedTests = [...staticTests, ...cyclicTests].filter(t => t.finished).length;

          if (testCategory === "static") {
            totalTests = staticTests.length;
            completedTests = staticTests.filter(t => t.finished).length;
          } else if (testCategory === "cyclic") {
            totalTests = cyclicTests.length;
            completedTests = cyclicTests.filter(t => t.finished).length;
          }

          projectMap.set(key, {
            deviceName: device.name,
            projectName: project.name,
            parentName: project.parent_name || (project.parent_id == null ? "Legacy" : String(project.parent_id)),
            totalTests,
            completedTests,
            staticTestsCount: staticTests.length,
            cyclicTestsCount: cyclicTests.length,
            projectData: project,
          });
        }
      });
    });

    return Array.from(projectMap.values());
  }, [
    useStateProjects,
    projectsFromState,
    decodedDeviceName,
    decodedParentName,
    devices,
    testCategory,
    routeDeviceName,
    routeParentName,
    parentIdFromState,
  ]);

  // Filters
  const filteredProjects = projectRows.filter(
    (row) =>
      (deviceFilter === "" || row.deviceName === deviceFilter) &&
      (projectFilter === "" || row.projectName.toLowerCase().includes(projectFilter.toLowerCase()))
  );

  const deviceNames = [...new Set(projectRows.map((r) => r.deviceName))];

  const handleProjectClick = (project) => {
    navigate(
      `/projects/${encodeURIComponent(project.projectName)}/tests/select-type`,
      {
        state: {
          projectData: project.projectData,
          deviceName: project.deviceName,
          projectName: project.projectName,
        },
      }
    );
  };

  const handleBackClick = () => {
    if (routeDeviceName && routeParentName) {
      navigate(`/devices/${encodeURIComponent(routeDeviceName)}/parents`);
    } else {
      navigate("/devices");
    }
  };

  const getPageTitle = () => {
    if (routeDeviceName && routeParentName) {
      return `Specimens for Project: ${decodedParentName}`;
    }
    return "All Projects Overview";
    };

  if (loading) return <div className={styles.container}>Loading data...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleBackClick}>Back</button>

      <h2 className={styles.heading}>{getPageTitle()}</h2>

      <div className={styles.filters}>
        {!routeDeviceName && (
          <div>
            <label className={styles.filterLabel}>Device</label>
            <select
              className={styles.filterSelect}
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
            >
              <option value="">All Devices</option>
              {deviceNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={styles.filterLabel}>Project Name</label>
          <input
            type="text"
            className={styles.filterSelect}
            placeholder="Type to search projects..."
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {!routeDeviceName && <th>Device</th>}
              {!routeParentName && <th>Parent</th>}
              <th>Project Name</th>
              <th>Total Tests</th>
              <th>Completed Tests</th>
              <th>Static Tests</th>
              <th>Cyclic Tests</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={routeDeviceName && routeParentName ? "6" : "8"} className={styles.noData}>
                  No matching projects found
                </td>
              </tr>
            ) : (
              filteredProjects.map((project, index) => (
                <tr
                  key={index}
                  onClick={() => handleProjectClick(project)}
                  style={{ cursor: "pointer" }}
                  className={styles.clickableRow}
                >
                  {!routeDeviceName && <td>{project.deviceName}</td>}
                  {!routeParentName && <td>{project.parentName}</td>}
                  <td><strong>{project.projectName}</strong></td>
                  <td>{project.totalTests}</td>
                  <td>{project.completedTests}</td>
                  <td>{project.staticTestsCount}</td>
                  <td>{project.cyclicTestsCount}</td>
                  <td>
                    {project.totalTests > 0
                      ? `${Math.round((project.completedTests / project.totalTests) * 100)}%`
                      : "0%"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
