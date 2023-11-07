import React from "react";

// Primereact imports
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";

const AddDialog = ({
  addDialog,
  setAddDialog,
  trackerDescription,
  setTrackerDescription,
  handleAddNew,
}) => {
  return (
    <Dialog
      header="Start new timer"
      visible={addDialog}
      onHide={() => setAddDialog(false)}
    >
      <span className="p-float-label mt-5">
        <InputTextarea
          id="description"
          autoResize
          value={trackerDescription}
          onChange={(e) => setTrackerDescription(e.target.value)}
          rows={5}
          cols={50}
        />
        <label htmlFor="description">Type description of new timer</label>
      </span>

      <Button onClick={handleAddNew} label="Add" severity="secondary" />
    </Dialog>
  );
};

export default AddDialog;
