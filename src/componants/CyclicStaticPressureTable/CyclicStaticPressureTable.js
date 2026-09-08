import CyclicPressureTable from "./CyclicPressureTable";
import CyclicStaticHeader from "./CyclicStaticHeader";
import StaticPressureTable from "./StaticPressureTable";
import ImpactTestsTable from "../impact/ImpactTestsTable";
import { useState } from "react";

const CyclicStaticPressureTable = ({
  toggle,
  designLoadPositive,
  designLoadNegative,
  fullLoadPositive,
  fullLoadNegative,
  neededDevice,
  clicked,
  projectID,
  setProjectData,
  status,
}) => {
  // console.log("toggle", toggle);
  const [isEditableCyclic, setIsEditableCyclic] = useState(false);
  const [isEditableStatic, setIsEditableStatic] = useState(false);

  if (toggle === "impact") {
    return (
      <ImpactTestsTable
        projectID={projectID}
        neededDevice={neededDevice}
        status={status}
      />
    );
  }

  return (
    <>
      {toggle === "dynamic_load" ? (
        <>
          <CyclicPressureTable
            designLoadPositive={designLoadPositive}
            designLoadNegative={designLoadNegative}
            fullLoadPositive={fullLoadPositive}
            fullLoadNegative={fullLoadNegative}
            neededDevice={neededDevice}
            clicked={clicked}
            isEditable={isEditableCyclic}
            setIsEditable={setIsEditableCyclic}
            projectID={projectID}
            type="Cyclic"
            setProjectData={setProjectData}
          />
        </>
      ) : (
        <>
          <StaticPressureTable
            designLoadPositive={designLoadPositive}
            designLoadNegative={designLoadNegative}
            fullLoadPositive={fullLoadPositive}
            fullLoadNegative={fullLoadNegative}
            neededDevice={neededDevice}
            clicked={clicked}
            isEditable={isEditableStatic}
            setIsEditable={setIsEditableStatic}
            projectID={projectID}
            type="Static"
            setProjectData={setProjectData}
          />
        </>
      )}
    </>
  );
};
export default CyclicStaticPressureTable;
