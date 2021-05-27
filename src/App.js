import { useEffect } from "react";
import { Loader } from "@livechat/design-system";

import { useFetchDonates, useCreateDonate, useFetchTotal } from "./hooks";
import { authenticateAnonymously } from "./utils/firestore";
import Donate from "./components/Donate";

function App() {
  const { state: fetchState, donates } = useFetchDonates();
  const { state: createState, createDonate } = useCreateDonate();
  const { total } = useFetchTotal({ trigger: donates });

  const isCreatePending = createState === "pending";
  const isFetchPending = fetchState === "pending";

  useEffect(() => {
    authenticateAnonymously();
  }, []);

  const renderDonates = () => {
    if (isFetchPending) {
      return (
        <div className="loader">
          <Loader
            primaryColor="#d64646"
            secondaryColor="#eec4c5"
            size="large"
          />
        </div>
      );
    }

    if (!donates.length) {
      return <span className="info">No donates here</span>;
    }

    return donates.map((donate, index) => (
      <Donate key={donate.id || `donate-${index}`} donate={donate} />
    ));
  };

  return (
    <div className="main-container">
      <p className="label">DPS Donates 💸</p>
      <button className="btn-add" onClick={createDonate}>
        {isCreatePending ? "Pending..." : "Add random donate"}
      </button>
      <div className="total">Total donates: {total} $</div>
      <div className="donates-container">{renderDonates()}</div>
    </div>
  );
}

export default App;
