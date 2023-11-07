import React from "react";

import { formatTime, formatDate } from "../utils/formatUtils";

// Primereact imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

const HistoryTable = ({
  isLoading,
  editTimer,
  deleteTimer,
  startDate,
  onCalendarAfterFilterChange,
  endDate,
  onCalendarBeforeFilterChange,
  globalFilterValue,
  onGlobalFilterChange,
  filters,
  timers,
}) => {
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          text
          severity="secondary"
          className="!text-[#5F6B8A]"
          onClick={() => editTimer(rowData)}
        />
        <Button
          icon="pi pi-trash"
          text
          severity="secondary"
          className="!text-[#5F6B8A]"
          onClick={() => deleteTimer(rowData)}
        />
      </>
    );
  };

  const toolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-column gap-1">
          <label className="text-[14px] text-[#5F6B8A]" htmlFor="date_from">
            Start date
          </label>
          <Calendar
            className="w-[330px] h-[42px]"
            inputClassName="border-none !rounded-tr-none !rounded-br-none"
            inputId="date_from"
            value={startDate}
            onChange={onCalendarAfterFilterChange}
            dateFormat="dd.mm.yy."
            showIcon
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-[14px] text-[#5F6B8A]" htmlFor="date_to">
            End date
          </label>
          <Calendar
            className="w-[330px] h-[42px]"
            inputClassName="border-none !rounded-tr-none !rounded-br-none"
            inputId="date_to"
            value={endDate}
            onChange={onCalendarBeforeFilterChange}
            dateFormat="dd.mm.yy."
            showIcon
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-[14px] text-[#5F6B8A]" htmlFor="search_input">
            Description contains
          </label>
          <span className="p-input-icon-right">
            <i className="pi pi-times" onClick={onGlobalFilterChange} />
            <InputText
              className="w-[330px] h-[42px] border-none"
              id="search_input"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isLoading ? (
        <div className="card">
          <Toolbar
            className="mb-[50px] h-[111px] border-none"
            center={toolbarTemplate}
          ></Toolbar>
          <DataTable
            dataKey="id"
            filters={filters}
            paginator
            paginatorClassName="mt-[150px] border-none"
            rows={2}
            value={timers}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
            globalFilter={globalFilterValue}
          >
            <Column
              field="created_at"
              header="Date"
              filterField="created_at"
              dataType="date"
              body={(rowData) => formatDate(rowData.created_at)}
              style={{ width: "220px" }}
            ></Column>
            <Column field="description" header="Description"></Column>
            <Column
              field="seconds"
              header="Time tracked"
              body={(rowData) => formatTime(rowData.seconds)}
              style={{ width: "230px" }}
            ></Column>
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

export default HistoryTable;
