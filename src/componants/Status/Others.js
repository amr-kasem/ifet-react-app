// import React from "react";

// const Others = ({
//   temperature,
//   humidity,
//   handleTemperatureChange,
//   handleHumidityChange,
//   startInterval,
// }) => {
//   return (
//     <tr>
//       <td colSpan="4">
//         <div className="d-flex justify-content-around">
//           <div className="form-group mr-2">
//             <label htmlFor="temperature">Temperature</label>
//             <input
//               type="number"
//               className="form-control"
//               id="temperature"
//               placeholder="Enter number here"
//               onChange={handleTemperatureChange}
//               value={temperature}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="humidity">Humidity</label>
//             <input
//               type="number"
//               className="form-control"
//               id="humidity"
//               placeholder="Enter number here"
//               onChange={handleHumidityChange}
//               value={humidity}
//             />
//           </div>
//           <button
//             style={{ marginLeft: "5px" }}
//             type="button"
//             className="btn btn-success btn-lg"
//             onClick={startInterval}
//           >
//             Send
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default Others;

const Others = ({
  temperature,
  humidity,
  handleTemperatureChange,
  handleHumidityChange,
  startInterval,
}) => {
  return (
    <table className="table">
      <tbody>
        <tr>
          <td colSpan="4">
            <div className="d-flex justify-content-around">
              <div className="form-group mr-2">
                <label htmlFor="temperature">Temperature</label>
                <input
                  type="number"
                  className="form-control"
                  id="temperature"
                  placeholder="Enter number here"
                  onChange={handleTemperatureChange}
                  value={temperature}
                />
              </div>
              <div className="form-group">
                <label htmlFor="humidity">Humidity</label>
                <input
                  type="number"
                  className="form-control"
                  id="humidity"
                  placeholder="Enter number here"
                  onChange={handleHumidityChange}
                  value={humidity}
                />
              </div>
              <button
                style={{ marginLeft: "5px" }}
                type="button"
                className="btn btn-success btn-lg"
                onClick={startInterval}
              >
                Send
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Others;
