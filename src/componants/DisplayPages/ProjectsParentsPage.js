// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import styles from "./ProjectsParentsPage.module.css";

// export default function ProjectsParentPage() {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [parentFilter, setParentFilter] = useState("");
//   const navigate = useNavigate();
//   const { deviceName } = useParams();

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

//   // Transform data to project parent level view
//   const projectParentRows = useMemo(() => {
//     if (!devices || devices.length === 0) return [];
    
//     // Filter by specific device if deviceName is provided
//     const filteredDevices = deviceName 
//       ? devices.filter(device => device.name === decodeURIComponent(deviceName))
//       : devices;

//     const parentMap = new Map();

//     filteredDevices.forEach((device) => {
//       const projects = device.projects || [];
//       projects.forEach((project) => {
//         // Get parent from project, default to "Legacy" if not present
//         const parent = project.parent_id || "Legacy";
//         const key = `${device.name}-${parent}`;
        
//         if (!parentMap.has(key)) {
//           parentMap.set(key, {
//             deviceName: device.name,
//             parentName: parent,
//             projects: [],
//             totalProjects: 0,
//             totalStaticTests: 0,
//             totalCyclicTests: 0,
//             completedStaticTests: 0,
//             completedCyclicTests: 0,
//           });
//         }

//         const parentRow = parentMap.get(key);
//         parentRow.projects.push(project);
//         parentRow.totalProjects += 1;
        
//         // Count tests
//         const staticTests = project.static_tests || [];
//         const cyclicTests = project.cyclic_tests || [];
        
//         parentRow.totalStaticTests += staticTests.length;
//         parentRow.totalCyclicTests += cyclicTests.length;
//         parentRow.completedStaticTests += staticTests.filter(test => test.finished).length;
//         parentRow.completedCyclicTests += cyclicTests.filter(test => test.finished).length;
//       });
//     });

//     return Array.from(parentMap.values());
//   }, [devices, deviceName]);

//   // Filter project parents
//   const filteredProjectParents = projectParentRows.filter(
//     (row) =>
//       parentFilter === "" ||
//       row.parentName.toLowerCase().includes(parentFilter.toLowerCase())
//   );

//   const handleProjectParentClick = (projectParent) => {
//     navigate(`/devices/${encodeURIComponent(projectParent.deviceName)}/parents/${encodeURIComponent(projectParent.parentName)}/projects`, {
//       state: {
//         deviceName: projectParent.deviceName,
//         parentName: projectParent.parentName,
//         projects: projectParent.projects,
//       },
//     });
//   };

//   const handleBackClick = () => {
//     if (deviceName) {
//       // If we're viewing a specific device's parents, go back to devices list
//       navigate("/devices");
//     } else {
//       // If we're viewing all parents, go back to home
//       navigate("/");
//     }
//   };

//   if (loading) return <div className={styles.container}>Loading data...</div>;

//   return (
//     <div className={styles.container}>
//       <button className={styles.button} onClick={handleBackClick}>
//         Back
//       </button>

//       <h2 className={styles.heading}>
//         {deviceName ? `Projects for device ${deviceName}` : "Project Parents Overview"}
//       </h2>

//       {/* Filter Controls */}
//       <div className={styles.filters}>
//         <div>
//           <label className={styles.filterLabel}>Parent Name</label>
//           <input
//             type="text"
//             className={styles.filterSelect}
//             placeholder="Type to search parents..."
//             value={parentFilter}
//             onChange={(e) => setParentFilter(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Project Parents Table */}
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Device</th>
//               <th>Parent Name</th>
//               <th>Total Specimens</th>
//               <th>Static Tests</th>
//               <th>Cyclic Tests</th>
//               <th>Completed Static</th>
//               <th>Completed Cyclic</th>
//               <th>Overall Progress</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjectParents.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className={styles.noData}>
//                   No matching project parents found
//                 </td>
//               </tr>
//             ) : (
//               filteredProjectParents.map((parent, index) => {
//                 const totalTests = parent.totalStaticTests + parent.totalCyclicTests;
//                 const completedTests = parent.completedStaticTests + parent.completedCyclicTests;
//                 const progressPercentage = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;
                
//                 return (
//                   <tr
//                     key={index}
//                     onClick={() => handleProjectParentClick(parent)}
//                     style={{ cursor: "pointer" }}
//                     className={styles.clickableRow}
//                   >
//                     <td>{parent.deviceName}</td>
//                     <td>
//                       <strong className={styles.parentName}>{parent.parentName}</strong>
//                     </td>
//                     <td>{parent.totalProjects}</td>
//                     <td>
//                       <span className={styles.testCount}>
//                         {parent.totalStaticTests}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={styles.testCount}>
//                         {parent.totalCyclicTests}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={styles.completedCount}>
//                         {parent.completedStaticTests}/{parent.totalStaticTests}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={styles.completedCount}>
//                         {parent.completedCyclicTests}/{parent.totalCyclicTests}
//                       </span>
//                     </td>
//                     <td>
//                       <div className={styles.progressContainer}>
//                         <div className={styles.progressBar}>
//                           <div 
//                             className={styles.progressFill}
//                             style={{ width: `${progressPercentage}%` }}
//                           ></div>
//                         </div>
//                         <span className={styles.progressText}>{progressPercentage}%</span>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProjectsParentsPage.module.css";

export default function ProjectsParentPage() {
  const [devices, setDevices] = useState([]);
  const [parents, setParents] = useState([]);                 // NEW
  const [loading, setLoading] = useState(true);
  const [parentFilter, setParentFilter] = useState("");
  const navigate = useNavigate();
  const { deviceName } = useParams();

  // Build an ID -> name map for parents
  const parentsMap = useMemo(() => {
    const map = new Map();
    (parents || []).forEach(p => map.set(String(p.id), p.name));
    return map;
  }, [parents]);

  // Fetch devices
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://${window.location.hostname}:8000/devices/`);
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch parents (your function, inlined here)
  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:8000/project-parents`)
      .then((response) => {
        console.log("Parents fetched:", response.data);
        setParents(response.data || []);
      })
      .catch((error) => {
        console.error("There was an error fetching the parents!", error);
        setParents([]);
      });
  }, []);

  // Transform data to project parent level view
  const projectParentRows = useMemo(() => {
    if (!devices || devices.length === 0) return [];

    const filteredDevices = deviceName
      ? devices.filter((device) => device.name === decodeURIComponent(deviceName))
      : devices;

    const parentMapAgg = new Map();

    filteredDevices.forEach((device) => {
      const projects = device.projects || [];
      projects.forEach((project) => {
        // parent_id comes from project; resolve a display name via parentsMap
        const parentId = project.parent_id ?? null;
        const parentName =
          parentId == null
            ? "Legacy"
            : parentsMap.get(String(parentId)) || `Parent #${parentId}`;

        // Group by device + parentId (null -> 'legacy')
        const key = `${device.name}-${parentId ?? "legacy"}`;

        if (!parentMapAgg.has(key)) {
          parentMapAgg.set(key, {
            deviceName: device.name,
            parentId,         // keep for downstream filtering if needed
            parentName,       // show in UI & use in URL (for your existing pages)
            projects: [],
            totalProjects: 0,
            totalStaticTests: 0,
            totalCyclicTests: 0,
            completedStaticTests: 0,
            completedCyclicTests: 0,
          });
        }

        const parentRow = parentMapAgg.get(key);
        parentRow.projects.push(project);
        parentRow.totalProjects += 1;

        const staticTests = project.static_tests || [];
        const cyclicTests = project.cyclic_tests || [];

        parentRow.totalStaticTests += staticTests.length;
        parentRow.totalCyclicTests += cyclicTests.length;
        parentRow.completedStaticTests += staticTests.filter((t) => t.finished).length;
        parentRow.completedCyclicTests += cyclicTests.filter((t) => t.finished).length;
      });
    });

    return Array.from(parentMapAgg.values());
  }, [devices, deviceName, parentsMap]); // <-- include parentsMap

  // Filter by parent *name*
  const filteredProjectParents = projectParentRows.filter(
    (row) =>
      parentFilter === "" ||
      (row.parentName || "").toLowerCase().includes(parentFilter.toLowerCase())
  );

  const handleProjectParentClick = (row) => {
    // Keep URL using the *name* because your details page works with names ("Legacy" worked, "1" didn't)
    navigate(
      `/devices/${encodeURIComponent(row.deviceName)}/parents/${encodeURIComponent(row.parentName)}/projects`,
      {
        state: {
          deviceName: row.deviceName,
          parentId: row.parentId,     // pass ID for robust filtering on the next page
          parentName: row.parentName,
          projects: row.projects,
        },
      }
    );
  };

  const handleBackClick = () => {
    if (deviceName) navigate("/devices");
    else navigate("/");
  };

  if (loading) return <div className={styles.container}>Loading data...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleBackClick}>
        Back
      </button>

      <h2 className={styles.heading}>
        {deviceName ? `Projects for device ${deviceName}` : "Project Parents Overview"}
      </h2>

      {/* Filter Controls */}
      <div className={styles.filters}>
        <div>
          <label className={styles.filterLabel}>Parent Name</label>
          <input
            type="text"
            className={styles.filterSelect}
            placeholder="Type to search parents..."
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Project Parents Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device</th>
              <th>Parent</th>
              <th>Total Specimens</th>
              <th>Static Tests</th>
              <th>Cyclic Tests</th>
              <th>Completed Static</th>
              <th>Completed Cyclic</th>
              <th>Overall Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjectParents.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  No matching project parents found
                </td>
              </tr>
            ) : (
              filteredProjectParents.map((parent, index) => {
                const totalTests = parent.totalStaticTests + parent.totalCyclicTests;
                const completedTests =
                  parent.completedStaticTests + parent.completedCyclicTests;
                const progressPercentage =
                  totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;

                return (
                  <tr
                    key={index}
                    onClick={() => handleProjectParentClick(parent)}
                    style={{ cursor: "pointer" }}
                    className={styles.clickableRow}
                  >
                    <td>{parent.deviceName}</td>
                    <td>
                      <strong className={styles.parentName}>{parent.parentName}</strong>
                    </td>
                    <td>{parent.totalProjects}</td>
                    <td><span className={styles.testCount}>{parent.totalStaticTests}</span></td>
                    <td><span className={styles.testCount}>{parent.totalCyclicTests}</span></td>
                    <td>
                      <span className={styles.completedCount}>
                        {parent.completedStaticTests}/{parent.totalStaticTests}
                      </span>
                    </td>
                    <td>
                      <span className={styles.completedCount}>
                        {parent.completedCyclicTests}/{parent.totalCyclicTests}
                      </span>
                    </td>
                    <td>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{progressPercentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
