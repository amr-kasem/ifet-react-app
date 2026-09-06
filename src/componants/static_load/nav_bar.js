// import logo from "../../images/Logo.png";
// import ValvesCommon from "../Status/ValvesCommon";
// import { useNavigate } from "react-router-dom";

// const NavBar = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <nav className="navbar navbar-dark bg-dark fixed-top">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             <div className="container">
//               <img
//                 src={logo}
//                 alt=""
//                 width="30"
//                 height="24"
//                 className="d-inline-block align-text-top"
//               />
//               Lap ADM
//             </div>
//           </a>
//           {/* <button
//             onClick={() => navigate("/projects")}
//             style={{ position: "absolute", zIndex: "1000" }}
//           >
//             All Projects
//           </button> */}
//           <ValvesCommon />
//         </div>
//       </nav>
//     </>
//   );
// };

// export default NavBar;


import logo from "../../images/Logo.png";
import ValvesCommon from "../Status/ValvesCommon";
import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.containerFluid}>
        <a className={styles.brand} href="#">
          <img
            src={logo}
            alt="Logo"
            className={styles.logo}
          />
          Lap ADM
        </a>
        <button
          className={styles.projectsButton}
          onClick={() => navigate("/devices")}
        >
          Devices Details
        </button>
        <ValvesCommon />
      </div>
    </nav>
  );
};

export default NavBar;
