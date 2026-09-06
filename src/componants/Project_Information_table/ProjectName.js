// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// const ProjectName = ({
//   projectID,
//   HandleProjectName,
//   projects,
//   deviceID,
//   isEditable,
//   status,
//   handleSaveEditClick,
//   handleNewProjectClick,
//   setProjectName,
//   projectName,
//   parents,
//   selectedParent,
//   setSelectedParent,
//   handleNewParentClick,
// }) => {
//   const navigate = useNavigate();
//   const [editableParentName, setEditableParentName] = useState("");
//   useEffect(() => {
//     const parent = parents.find((p) => p.value === selectedParent);
//     setEditableParentName(parent ? parent.name : "");
//   }, [selectedParent, parents]);



//   useEffect(() => {
//     // console.log("Projects in ProjectName:", projects);
//     const selectedProject = projects.find(
//       (project) => project.id === projectID
//     );
//     if (selectedProject) {
//       setProjectName(selectedProject.name);
//       if (
//         selectedProject.parent_id &&
//         parents.find((p) => p.id === selectedProject.parent_id)
//       ) {
//         console.log("Projects in ProjectName: in")
//         setSelectedParent(selectedProject.parent_id);
//       } else {
//         setSelectedParent("legacy");
//       }
//     }
//   }, []);
//   // }, [projectID, isEditable, projects, parents]);

//   const handleEditProjectName = (e) => {
//     setProjectName(e.target.value);
//   };

//   const handleParentChange = (e) => {
//     setSelectedParent(e.target.value);
//   };

//   return (
//     <div className="row">
//       <div className="col-6 col-md-5 col-lg-4 mt-3">
//         <h4>Projects Information</h4>
//       </div>

//       <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center">
//         <div className="form-floating me-3" style={{ minWidth: "150px" }}>
//           <select
//             className="form-control"
//             id="parentSelect"
//             value={selectedParent}
//             onChange={handleParentChange}
//             disabled={isEditable}
//           >
//             <option value="legacy">Legacy</option>
//             {parents.map((parent) => (
//               <option key={parent.id} value={parent.id}>
//                 {parent.name}
//               </option>
//             ))}
//           </select>

//           {/* {isEditable ? (
//             <input
//               type="text"
//               className="form-control"
//               id="parentInput"
//               value={editableParentName}
//               onChange={(e) => setEditableParentName(e.target.value)}
//             />
//           ) : (
//             <select
//               className="form-control"
//               id="parentSelect"
//               value={selectedParent}
//               onChange={handleParentChange}
//             >
//               <option value="legacy">Legacy</option>
//               {parents.map((parent) => (
//                 <option key={parent.id || parent.value} value={parent.value}>
//                   {parent.name}
//                 </option>
//               ))}
//             </select>
//           )} */}

//           <label htmlFor="parentSelect">
//             {/* Project Parent */}
//             {/* namming */}
//             Project
//           </label>
//         </div>

//         <button
//           type="button"
//           className="btn btn-warning btn-lg me-2"
//           id="NewProject1"
//           disabled={status !== "idle"}
//           onClick={handleNewParentClick}
//         >
//           +
//         </button>

//         <div className="form-floating me-3 flex-grow-1">
//           {isEditable ? (
//             <input
//               type="text"
//               className="form-control"
//               id="floatingInput"
//               value={projectName}
//               onChange={handleEditProjectName}
//             />
//           ) : projects.length === 0 ? (
//             // <p>No projects available for selected parent.</p>
//             <select
//               className="form-control"
//               id="floatingInput"
//               value={projectID}
//               onChange={HandleProjectName}
//             >
//               <option disabled value="">
//                 No specimen available for selected project
//               </option>
//             </select>
//           ) : (
//             <select
//               className="form-control"
//               id="floatingInput"
//               value={projectID}
//               onChange={HandleProjectName}
//             >
//               {/* <option value="">Select a project</option> */}
//               {/* namming */}
//               <option value="">Select a specimen</option>
//               {projects.map((project) => (
//                 <option key={project.id} value={project.id}>
//                   {project.name}
//                 </option>
//               ))}
//             </select>
//           )}
//           <label htmlFor="floatingInput">
//             {/* Project Name */}
//             {/* namming */}
//             Specimen Name
//           </label>
//         </div>

//         {/* <button
//           type="button"
//           className="btn btn-primary btn-lg me-2"
//           id="NewProject2"
//           onClick={() =>
//             navigate(`/report/device/${deviceID}/project/${projectID}`)
//           }
//         >
//           Details
//         </button> */}
//         <button
//           type="button"
//           className="btn btn-primary btn-lg me-2"
//           id="file"
//            onClick={() => {
//               if (!projectID) return; // optional guard
//               const url = `http://${window.location.hostname}:8000/projects/${projectID}/report`;
//               window.open(url, "_blank", "noopener,noreferrer");
//             }}
//         >
//           get report
//         </button>

//         <button
//           type="button"
//           className={`btn btn-lg me-2 ${
//             isEditable ? "btn-danger" : "btn-primary"
//           }`}
//           disabled={status !== "idle"}
//           id="NewPr"
//           onClick={() => handleSaveEditClick(projectName)}
//         >
//           {isEditable ? "Save" : "Edit"}
//         </button>

//         <button
//           type="button"
//           className="btn btn-warning btn-lg me-2"
//           id="NewProject1"
//           disabled={status !== "idle"}
//           onClick={handleNewProjectClick}
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectName;











// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// const ProjectName = ({
//   projectID,
//   HandleProjectName,
//   projects,
//   deviceID,
//   isEditable,
//   status,
//   handleSaveEditClick,
//   handleNewProjectClick,
//   setProjectName,
//   projectName,
//   parents,
//   selectedParent,
//   setSelectedParent,
//   handleNewParentClick,
//   handleParentChange,
// }) => {
//   const navigate = useNavigate();
//   const [editableParentName, setEditableParentName] = useState("");

//   useEffect(() => {
//     const parent = parents.find((p) => p.id === selectedParent);
//     setEditableParentName(parent ? parent.name : "");
//   }, [selectedParent, parents]);

//   const handleEditProjectName = (e) => {
//     setProjectName(e.target.value);
//   };

//   const handleParentSelectChange = (e) => {
//     const newParentId = e.target.value;
//     console.log("=== PARENT SELECT CHANGE ===");
//     console.log("User selected parent:", newParentId);
    
//     // Call the parent change handler immediately
//     handleParentChange(newParentId);
//   };

//   const handleSpecimenSelectChange = (e) => {
//     console.log("=== SPECIMEN SELECT CHANGE ===");
//     console.log("User selected specimen:", e.target.value);
//     HandleProjectName(e);
//   };

//   return (
//     <div className="row">
//       <div className="col-6 col-md-5 col-lg-4 mt-3">
//         <h4>Projects Information</h4>
//       </div>

//       <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center">
//         <div className="form-floating me-3" style={{ minWidth: "150px" }}>
//           <select
//             className="form-control"
//             id="parentSelect"
//             value={selectedParent}
//             onChange={handleParentSelectChange}
//             disabled={isEditable}
//           >
//             <option value="legacy">Legacy</option>
//             {parents.map((parent) => (
//               <option key={parent.id} value={parent.id}>
//                 {parent.name}
//               </option>
//             ))}
//           </select>

//           <label htmlFor="parentSelect">
//             Project
//           </label>
//         </div>

//         <button
//           type="button"
//           className="btn btn-warning btn-lg me-2"
//           id="NewProject1"
//           disabled={status !== "idle"}
//           onClick={handleNewParentClick}
//         >
//           +
//         </button>

//         <div className="form-floating me-3 flex-grow-1">
//           {isEditable ? (
//             <input
//               type="text"
//               className="form-control"
//               id="floatingInput"
//               value={projectName}
//               onChange={handleEditProjectName}
//             />
//           ) : projects.length === 0 ? (
//             <select
//               className="form-control"
//               id="floatingInput"
//               value=""
//               onChange={handleSpecimenSelectChange}
//               disabled
//             >
//               <option value="">
//                 No specimen available for selected project
//               </option>
//             </select>
//           ) : (
//             <select
//               className="form-control"
//               id="floatingInput"
//               value={projectID || ""}
//               onChange={handleSpecimenSelectChange}
//             >
//               <option value="">Select a specimen</option>
//               {projects.map((project) => (
//                 <option key={project.id} value={project.id}>
//                   {project.name}
//                 </option>
//               ))}
//             </select>
//           )}
//           <label htmlFor="floatingInput">
//             Specimen Name
//           </label>
//         </div>

//         <button
//           type="button"
//           className="btn btn-primary btn-lg me-2"
//           id="file"
//           onClick={() => {
//             if (!projectID) return;
//             const url = `http://${window.location.hostname}:8000/projects/${projectID}/report`;
//             window.open(url, "_blank", "noopener,noreferrer");
//           }}
//         >
//           get report
//         </button>

//         <button
//           type="button"
//           className={`btn btn-lg me-2 ${
//             isEditable ? "btn-danger" : "btn-primary"
//           }`}
//           disabled={status !== "idle"}
//           id="NewPr"
//           onClick={() => handleSaveEditClick(projectName)}
//         >
//           {isEditable ? "Save" : "Edit"}
//         </button>

//         <button
//           type="button"
//           className="btn btn-warning btn-lg me-2"
//           id="NewProject1"
//           disabled={status !== "idle"}
//           onClick={handleNewProjectClick}
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectName;






// omda 23/8
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ProjectName = ({
  projectID,
  HandleProjectName,
  projects,
  deviceID,
  isEditable,
  status,
  handleSaveEditClick,
  handleNewProjectClick,
  setProjectName,
  projectName,
  parents,
  selectedParent,
  setSelectedParent,
  handleNewParentClick,
  handleParentChange,
}) => {
  const navigate = useNavigate();
  const [editableParentName, setEditableParentName] = useState("");
  const [parentSearchTerm, setParentSearchTerm] = useState("");
  const [specimenSearchTerm, setSpecimenSearchTerm] = useState("");
  const [parentDropdownSearch, setParentDropdownSearch] = useState(""); // Separate search for dropdown
  const [specimenDropdownSearch, setSpecimenDropdownSearch] = useState(""); // Separate search for dropdown
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [showSpecimenDropdown, setShowSpecimenDropdown] = useState(false);
  const parentBlurTimeoutRef = useRef(null);
  const specimenBlurTimeoutRef = useRef(null);
  const parentDropdownRef = useRef(null);
  const specimenDropdownRef = useRef(null);

  useEffect(() => {
    console.log("omda_test_legacy",parents);
    if (selectedParent === "legacy") {
      setEditableParentName("Legacy");
      setParentSearchTerm("Legacy");
    } else {
      const parent = parents.find((p) => p.id === selectedParent);
      setEditableParentName(parent ? parent.name : "");
      setParentSearchTerm(parent ? parent.name : "");
    }
    setParentDropdownSearch(""); // Clear dropdown search when parent changes
  }, [selectedParent, parents]);

  useEffect(() => {
    const project = projects.find((p) => p.id === projectID);
    setSpecimenSearchTerm(project ? project.name : "");
    setSpecimenDropdownSearch(""); // Clear dropdown search when project changes
  }, [projectID, projects]);

  const handleEditProjectName = (e) => {
    setProjectName(e.target.value);
  };

  const handleParentSelectChange = (parentId, parentName) => {
    console.log("=== PARENT SELECT CHANGE ===");
    console.log("User selected parent:", parentId);
    setParentSearchTerm(parentName);
    setParentDropdownSearch(""); // Clear dropdown search
    setShowParentDropdown(false);
    handleParentChange(parentId);
  };

  const handleSpecimenSelectChange = (projectId, projectName) => {
    console.log("=== SPECIMEN SELECT CHANGE ===");
    console.log("User selected specimen:", projectId);
    setSpecimenSearchTerm(projectName);
    setSpecimenDropdownSearch(""); // Clear dropdown search
    setShowSpecimenDropdown(false);
    const event = { target: { value: projectId.toString() } };
    HandleProjectName(event);
  };

  // Filter parents based on dropdown search term (keep original order from backend, Legacy last)
  const filteredParents = parents
    .filter((parent) =>
      parent.name.toLowerCase().includes(parentDropdownSearch.toLowerCase())
    );
  
  // Separate Legacy from other parents and put it at the end
  const nonLegacyParents = filteredParents.filter(p => p.name.toLowerCase() !== "legacy");
  const legacyParents = filteredParents.filter(p => p.name.toLowerCase() === "legacy");
  const sortedFilteredParents = [...nonLegacyParents, ...legacyParents];

  // Filter projects based on dropdown search term (keep original order from backend)
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(specimenDropdownSearch.toLowerCase())
  );

  return (
    <div className="row">
      <div className="col-6 col-md-5 col-lg-4 mt-3">
        <h4>Projects Information</h4>
      </div>

      <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center">
        <div className="form-floating me-3" style={{ minWidth: "150px", position: "relative" }}>
          <input
            type="text"
            className="form-control"
            id="parentSelect"
            value={parentSearchTerm}
            onMouseDown={(e) => {
              // Clear any pending blur timeout
              if (parentBlurTimeoutRef.current) {
                clearTimeout(parentBlurTimeoutRef.current);
                parentBlurTimeoutRef.current = null;
              }
              // Toggle dropdown on click
              if (showParentDropdown) {
                setShowParentDropdown(false);
              } else {
                setShowParentDropdown(true);
                setParentDropdownSearch("");
              }
            }}
            onFocus={() => {
              // Clear any pending blur timeout
              if (parentBlurTimeoutRef.current) {
                clearTimeout(parentBlurTimeoutRef.current);
                parentBlurTimeoutRef.current = null;
              }
              if (!showParentDropdown) {
                setShowParentDropdown(true);
                setParentDropdownSearch("");
              }
            }}
            onBlur={(e) => {
              // Check if the new focus target is inside the dropdown
              const relatedTarget = e.relatedTarget;
              const dropdown = parentDropdownRef.current;
              
              if (dropdown && relatedTarget && dropdown.contains(relatedTarget)) {
                // Clicking inside dropdown, don't close
                return;
              }
              
              // Close dropdown after a short delay
              parentBlurTimeoutRef.current = setTimeout(() => {
                setShowParentDropdown(false);
                parentBlurTimeoutRef.current = null;
              }, 200);
            }}
            placeholder="Search project..."
            disabled={isEditable}
            autoComplete="off"
            style={{ cursor: isEditable ? 'not-allowed' : 'pointer' }}
            readOnly
          />
          <label htmlFor="parentSelect">Project</label>
          
          {showParentDropdown && !isEditable && (
            <div
              ref={parentDropdownRef}
              className="dropdown-menu show"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
                marginTop: "2px",
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside dropdown
            >
              <div className="px-2 py-1 border-bottom">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  value={parentDropdownSearch}
                  onChange={(e) => setParentDropdownSearch(e.target.value)}
                  autoFocus
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
              {sortedFilteredParents.map((parent) => (
                <button
                  key={parent.id}
                  type="button"
                  className="dropdown-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleParentSelectChange(parent.id, parent.name);
                  }}
                >
                  {parent.name}
                </button>
              ))}
              <button
                type="button"
                className="dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleParentSelectChange("legacy", "Legacy");
                }}
              >
                Legacy
              </button>
              {filteredParents.length === 0 && (
                <div className="dropdown-item-text text-muted">No results found</div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-warning btn-lg me-2"
          id="NewProject1"
          disabled={status !== "idle"}
          onClick={handleNewParentClick}
        >
          +
        </button>

        <div className="form-floating me-3 flex-grow-1" style={{ position: "relative" }}>
          {isEditable ? (
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value={projectName}
              onChange={handleEditProjectName}
            />
          ) : !selectedParent ? (
            // No parent selected - disable specimen dropdown
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value=""
              placeholder="Please select a project first"
              disabled
            />
          ) : projects.length === 0 ? (
            // Parent selected but no specimens available
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value=""
              placeholder="No specimen available for selected project"
              disabled
            />
          ) : (
            <>
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={specimenSearchTerm}
                onMouseDown={(e) => {
                  // Clear any pending blur timeout
                  if (specimenBlurTimeoutRef.current) {
                    clearTimeout(specimenBlurTimeoutRef.current);
                    specimenBlurTimeoutRef.current = null;
                  }
                  // Toggle dropdown on click
                  if (showSpecimenDropdown) {
                    setShowSpecimenDropdown(false);
                  } else {
                    setShowSpecimenDropdown(true);
                    setSpecimenDropdownSearch("");
                  }
                }}
                onFocus={() => {
                  // Clear any pending blur timeout
                  if (specimenBlurTimeoutRef.current) {
                    clearTimeout(specimenBlurTimeoutRef.current);
                    specimenBlurTimeoutRef.current = null;
                  }
                  if (!showSpecimenDropdown) {
                    setShowSpecimenDropdown(true);
                    setSpecimenDropdownSearch("");
                  }
                }}
                onBlur={(e) => {
                  // Check if the new focus target is inside the dropdown
                  const relatedTarget = e.relatedTarget;
                  const dropdown = specimenDropdownRef.current;
                  
                  if (dropdown && relatedTarget && dropdown.contains(relatedTarget)) {
                    // Clicking inside dropdown, don't close
                    return;
                  }
                  
                  // Close dropdown after a short delay
                  specimenBlurTimeoutRef.current = setTimeout(() => {
                    setShowSpecimenDropdown(false);
                    specimenBlurTimeoutRef.current = null;
                  }, 200);
                }}
                placeholder="Search specimen..."
                autoComplete="off"
                style={{ cursor: 'pointer' }}
                readOnly
              />
              
              {showSpecimenDropdown && (
                <div
                  ref={specimenDropdownRef}
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 1000,
                    marginTop: "2px",
                  }}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside dropdown
                >
                  <div className="px-2 py-1 border-bottom">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search..."
                      value={specimenDropdownSearch}
                      onChange={(e) => setSpecimenDropdownSearch(e.target.value)}
                      autoFocus
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      className="dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSpecimenSelectChange(project.id, project.name);
                      }}
                    >
                      {project.name}
                    </button>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="dropdown-item-text text-muted">No results found</div>
                  )}
                </div>
              )}
            </>
          )}
          <label htmlFor="floatingInput">
            Specimen Name
          </label>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg me-2"
          id="file"
          onClick={() => {
            if (!projectID) return;
            const url = `http://${window.location.hostname}:8000/projects/${projectID}/report`;
            window.open(url, "_blank", "noopener,noreferrer");
          }}
        >
          get report
        </button>

        <button
          type="button"
          className={`btn btn-lg me-2 ${
            isEditable ? "btn-danger" : "btn-primary"
          }`}
          disabled={status !== "idle"}
          id="NewPr"
          onClick={() => handleSaveEditClick(projectName)}
        >
          {isEditable ? "Save" : "Edit"}
        </button>

        <button
          type="button"
          className="btn btn-warning btn-lg me-2"
          id="NewProject1"
          disabled={status !== "idle" || !selectedParent}
          onClick={handleNewProjectClick}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProjectName;