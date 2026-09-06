// import { useNavigate } from "react-router-dom";
// import ProjectName from "./ProjectName";
// import DesignLoadTable from "./DesignLoadTable";
// import DesignLoadTableNew from "./DesignLoadTableNew";

// const ProjectInformationTable = ({
//   projectID,
//   HandleProjectName,
//   projects,
//   deviceID,
//   isEditable,
//   status,
//   handleSaveEditClick,
//   handleNewProjectClick,
//   positiveDesignLoad,
//   HandlePositiveDesignLoad,
//   negativeDesignLoad,
//   HandleNegativeDesignLoad,
//   setProjectName,
//   projectName,
//   parents, // New prop
//   selectedParent, // New prop
//   setSelectedParent, // New prop
//   handleNewParentClick,
//   handleParentChange,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="row">
//       <div className="col">
//         <ProjectName
//           projectID={projectID}
//           HandleProjectName={HandleProjectName}
//           projects={projects}
//           deviceID={deviceID}
//           isEditable={isEditable}
//           status={status}
//           handleSaveEditClick={handleSaveEditClick}
//           handleNewProjectClick={handleNewProjectClick}
//           setProjectName={setProjectName}
//           projectName={projectName}
//           parents={parents}
//           selectedParent={selectedParent}
//           setSelectedParent={setSelectedParent}
//           handleNewParentClick = {handleNewParentClick}
//         />

//         <DesignLoadTableNew
//           isEditable={isEditable}
//           positiveDesignLoad={positiveDesignLoad}
//           HandlePositiveDesignLoad={HandlePositiveDesignLoad}
//           negativeDesignLoad={negativeDesignLoad}
//           HandleNegativeDesignLoad={HandleNegativeDesignLoad}
//         />

//       </div>
//     </div>
//   );
// };

// export default ProjectInformationTable;



import { useNavigate } from "react-router-dom";
import ProjectName from "./ProjectName";
import DesignLoadTable from "./DesignLoadTable";
import DesignLoadTableNew from "./DesignLoadTableNew";

const ProjectInformationTable = ({
  projectID,
  HandleProjectName,
  projects,
  deviceID,
  isEditable,
  status,
  handleSaveEditClick,
  handleNewProjectClick,
  positiveDesignLoad,
  HandlePositiveDesignLoad,
  negativeDesignLoad,
  HandleNegativeDesignLoad,
  setProjectName,
  projectName,
  parents,
  selectedParent,
  setSelectedParent,
  handleNewParentClick,
  handleParentChange, // Make sure this is received from Information.js
}) => {
  const navigate = useNavigate();

  return (
    <div className="row">
      <div className="col">
        <ProjectName
          projectID={projectID}
          HandleProjectName={HandleProjectName}
          projects={projects}
          deviceID={deviceID}
          isEditable={isEditable}
          status={status}
          handleSaveEditClick={handleSaveEditClick}
          handleNewProjectClick={handleNewProjectClick}
          setProjectName={setProjectName}
          projectName={projectName}
          parents={parents}
          selectedParent={selectedParent}
          setSelectedParent={setSelectedParent}
          handleNewParentClick={handleNewParentClick}
          handleParentChange={handleParentChange} // Pass it down to ProjectName
        />

        <DesignLoadTableNew
          isEditable={isEditable}
          positiveDesignLoad={positiveDesignLoad}
          HandlePositiveDesignLoad={HandlePositiveDesignLoad}
          negativeDesignLoad={negativeDesignLoad}
          HandleNegativeDesignLoad={HandleNegativeDesignLoad}
        />
      </div>
    </div>
  );
};

export default ProjectInformationTable;