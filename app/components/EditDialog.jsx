import React from "react";

// Primereact imports
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";

const EditDialog = ({
  editDialog,
  setEditDialog,
  onInputChange,
  handleEdit,
  timer,
}) => {
  return (
    <Dialog
      header="Update timer"
      visible={editDialog}
      onHide={() => setEditDialog(false)}
    >
      <span className="p-float-label mt-5">
        <InputTextarea
          id="description"
          autoResize
          value={timer.description}
          onChange={(e) => onInputChange(e, "description")}
          rows={5}
          cols={50}
        />
        <label htmlFor="description">Type new description of timer</label>
      </span>

      <Button onClick={handleEdit} label="Update" severity="secondary" />
    </Dialog>
  );
};

export default EditDialog;
