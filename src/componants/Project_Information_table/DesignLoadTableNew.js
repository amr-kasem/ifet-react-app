import { useNavigate } from "react-router-dom";

const DesignLoadTableNew = ({
  isEditable,
  positiveDesignLoad,
  HandlePositiveDesignLoad,
  negativeDesignLoad,
  HandleNegativeDesignLoad,
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
              <th>
                <h5>Inward Design Load</h5>
              </th>
              <th>
                <h5>Outward Design Load</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesignLoadTableNew;
