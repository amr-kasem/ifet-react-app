import { useNavigate } from "react-router-dom";

const DesignLoadTable = ({
  isEditable,
  positiveDesignLoad,
  HandlePositiveDesignLoad,
  halfLoadPositive,
  designLoadPositive,
  fullLoadPositive,
  negativeDesignLoad,
  HandleNegativeDesignLoad,
  halfLoadNegative,
  designLoadNegative,
  fullLoadNegative,
}) => {
  const navigate = useNavigate();

  return (
    <div className="row">
      <div className="table-responsive">
        <table
          className="table text-center table-bordered align-middle"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="table-dark">
            <tr>
              <th></th>
              <th>
                <h5>Design load</h5>
              </th>
              <th>
                <h5>Half load</h5>
              </th>
              <th>
                <h5>Design Load</h5>
              </th>
              <th>
                <h5>Full Load</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="table-dark">
                <h5>Positive</h5>
              </th>
              <td>
                <input
                  type="number"
                  className="form-control text-center align-middle"
                  id="positiveDesignLoad"
                  placeholder="Positive Design load"
                  value={positiveDesignLoad}
                  min="-9999"
                  max="9999"
                  onChange={HandlePositiveDesignLoad}
                  disabled={!isEditable}
                />
              </td>
              <td id="halfLoadPositive">{halfLoadPositive}</td>
              <td id="designLoadPositive">{designLoadPositive}</td>
              <td id="fullLoadPositive">{fullLoadPositive}</td>
            </tr>
            <tr>
              <th className="table-dark">
                <h5>Negative</h5>
              </th>
              <td>
                <input
                  type="number"
                  className="form-control text-center align-middle"
                  id="negativeDesignLoad"
                  placeholder="Negative Design load"
                  value={negativeDesignLoad}
                  min="-9999"
                  max="9999"
                  onChange={HandleNegativeDesignLoad}
                  disabled={!isEditable}
                />
              </td>
              <td id="halfLoadNegative">{halfLoadNegative}</td>
              <td id="designLoadNegative">{designLoadNegative}</td>
              <td id="fullLoadNegative">{fullLoadNegative}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesignLoadTable;
