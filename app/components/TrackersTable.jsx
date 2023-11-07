import React from "react";

import { formatTime } from "../utils/formatUtils";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const TrackersTable = ({
  timers,
  activeTimerId,
  isLoading,
  startTimer,
  stopTimer,
  editTimer,
  deleteTimer,
}) => {
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon={`pi ${activeTimerId !== rowData.id ? "pi-play" : "pi-pause"}`}
          text
          onClick={() => startTimer(rowData)}
        />
        <Button
          icon="pi pi-stop-circle"
          text
          className="!text-[#5F6B8A]"
          onClick={() => stopTimer(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          text
          className="!text-[#5F6B8A]"
          onClick={() => editTimer(rowData)}
        />
        <Button
          icon="pi pi-trash"
          text
          className="!text-[#5F6B8A]"
          onClick={() => deleteTimer(rowData)}
        />
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        <div className="card">
          <DataTable
            dataKey="id"
            rows={2}
            value={timers}
            paginator
            paginatorClassName="mt-[150px] border-none"
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="seconds"
              header="Time logged"
              body={(rowData) => formatTime(rowData.seconds)}
              style={{ width: "145px" }}
            ></Column>
            <Column field="description" header="Description"></Column>
            <Column
              header="Actions"
              body={actionBodyTemplate}
              exportable={false}
              style={{ width: "230px" }}
            ></Column>
          </DataTable>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default TrackersTable;
