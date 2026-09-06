// import { useNavigate } from "react-router-dom";

// const CyclicStaticHeader = ({
//   isEditable,
//   status,
//   handleSaveEditClick,
//   handleNewProjectClick,
//   type,
// }) => {
//   const navigate = useNavigate();
//   console.log("status", status);

//   return (
//     <div className="row">
//       <div className="col-6 col-md-5 col-lg-4 mt-3">
//         <h4>{type} Pressure Differential Loading</h4>
//       </div>

//       <div className="col-6 col-md-7 col-lg-8 d-flex align-items-center justify-content-end">
//         <button
//           type="button"
//           className={`btn btn-lg me-2 ${
//             isEditable ? "btn-danger" : "btn-primary"
//           }`}
//           disabled={status !== "idle"}
//           id="NewPr"
//           onClick={() => handleSaveEditClick()}
//         >
//           {isEditable ? "Save" : "Edit"}
//         </button>

//         {/* New Project Button */}
//         <button
//           type="button"
//           className="btn btn-warning btn-lg me-2"
//           id="NewProject1"
//           disabled={status !== "idle"}
//           //   onClick={handleNewProjectClick}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CyclicStaticHeader;
