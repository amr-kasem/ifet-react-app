import "./App.css";
import StaticLoad from "./componants/static_load/static_load";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { reloadBootstrapData } from "./store/sensors-slice";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Report from "./componants/Report/Report";
import Projects from "./componants/Report/Projects";
import ValvesCommon from "./componants/Status/ValvesCommon";
import TrialsPage from "./componants/DisplayPages/TrialsPage";
import ProjectsPage from "./componants/DisplayPages/ProjectsPage";
import TestsPage from "./componants/DisplayPages/TestsPage";
import DeflectionsPage from "./componants/DisplayPages/DeflectionsPage";
import TestTypeSelectionPage from "./componants/DisplayPages/TestTypeSelectionPage";
import ProjectsParentPage from "./componants/DisplayPages/ProjectsParentsPage";
import DevicesPage from "./componants/DisplayPages/DevicesPage";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reloadBootstrapData());
  }, [dispatch]);
  

  return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<StaticLoad />} />
  //       <Route path="/report/device/:deviceID/project/:projectID" element={<Report />} />
  //       <Route path="/projects" element={<ProjectsPage />} /> {/* Point to ProjectsPage */}
  //       <Route path="/projects/:projectName/tests/select-type" element={<TestTypeSelectionPage />} />
  //       <Route path="/projects/:projectName/tests" element={<TestsPage />} />
  //       <Route path="/projects/:projectName/tests/:testId/trials" element={<TrialsPage />} />
  //       <Route path="/projects/:projectName/tests/:testId/trials/:trialId/deflections" element={<DeflectionsPage />} />
  //       <Route path="/trials" element={<TrialsPage />} />
  //     </Routes>
  // </Router>

  <Router>
    <Routes>
      <Route path="/" element={<StaticLoad />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/devices/:deviceName/parents" element={<ProjectsParentPage />} />
      <Route path="/devices/:deviceName/parents/:parentName/projects" element={<ProjectsPage />} /> {/* ADD THIS LINE */}
      <Route path="/report/device/:deviceID/project/:projectID" element={<Report />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectName/tests/select-type" element={<TestTypeSelectionPage />} />
      <Route path="/projects/:projectName/tests" element={<TestsPage />} />
      <Route path="/projects/:projectName/tests/:testId/trials" element={<TrialsPage />} />
      <Route path="/projects/:projectName/tests/:testId/trials/:trialId/deflections" element={<DeflectionsPage />} />
      <Route path="/trials" element={<TrialsPage />} />
    </Routes>
  </Router>
  );
}

export default App;
