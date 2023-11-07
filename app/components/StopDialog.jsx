import React from "react";

// Primereact imports
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const StopDialog = ({ stopDialog, setStopDialog, handleStop }) => {
  return (
    <Dialog
      header="Stop timer"
      visible={stopDialog}
      onHide={() => setStopDialog(false)}
    >
      <p>Are you sure you want to stop this timer?</p>
      <div className="flex justify-end gap-2 mt-5">
        <Button
          onClick={() => setStopDialog(false)}
          label="Cancel"
          outlined
          severity="secondary"
        />
        <Button onClick={handleStop} label="Stop" severity="secondary" />
      </div>
    </Dialog>
  );
};

export default StopDialog;
