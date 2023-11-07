import React from "react";

// Primereact imports
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const DeleteDialog = ({ deleteDialog, setDeleteDialog, handleDelete }) => {
  return (
    <Dialog
      header="Delete timer"
      visible={deleteDialog}
      onHide={() => setDeleteDialog(false)}
    >
      <p>Are you sure you want to delete this timer?</p>
      <div className="flex justify-end gap-2 mt-5">
        <Button
          onClick={() => setDeleteDialog(false)}
          label="Cancel"
          outlined
        />
        <Button onClick={handleDelete} label="Delete" />
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
