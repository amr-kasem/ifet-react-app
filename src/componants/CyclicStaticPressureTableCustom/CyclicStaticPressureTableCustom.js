
import StaticPressureTableCustom from "./StaticPressureTableCustom";
import CyclicPressureTableCustom from "./CyclicPressureTableCustom";

import { useState } from "react";

const CyclicStaticPressureTableCustom = ({
  toggle,
  designLoadPositive,
  designLoadNegative,
  fullLoadPositive,
  fullLoadNegative,
  neededDevice,
  clicked,
  projectID,
  setProjectData,
  // status,
}) => {
  // console.log("toggle", toggle);
  const [isEditableCyclic, setIsEditableCyclic] = useState(false);
  const [isEditableStatic, setIsEditableStatic] = useState(false);

  return (
    <>
    <h1>omdaaaaaaaaaaa</h1>
      {toggle === "dynamic_load" ? (
        <>
          <CyclicPressureTableCustom
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
          <StaticPressureTableCustom
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
export default CyclicStaticPressureTableCustom;
