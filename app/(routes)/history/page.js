"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { useTimersContext } from "@/app/context/TimerContext";

// Primereact imports
import { FilterMatchMode, FilterOperator } from "primereact/api";
import DeleteDialog from "@/app/components/DeleteDialog";
import EditDialog from "@/app/components/EditDialog";
import HistoryTable from "@/app/components/HistoryTable";

export default function History() {
  const { user } = useAuth();
  const router = useRouter();
  const { timers, dispatch } = useTimersContext();

  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Calendar states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Input states
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    created_at: {
      operator: FilterOperator.AND,
      constraints: [
        { value: null, matchMode: FilterMatchMode.DATE_AFTER },
        { value: null, matchMode: FilterMatchMode.DATE_BEFORE },
      ],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  let emptyTimer = {
    id: null,
    user_uid: null,
    seconds: 0,
    description: "",
    finished: false,
    created_at: null,
  };

  const [timer, setTimer] = useState(emptyTimer);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const q = query(
            collection(db, "timers"),
            where("user_uid", "==", user.uid),
            where("finished", "==", true)
          );
          const querySnapshot = await getDocs(q);

          const newData = [];

          querySnapshot.forEach((doc) => {
            const { created_at } = doc.data();
            const createdAtDate = new Date(created_at.seconds * 1000);
            newData.push({
              id: doc.id,
              ...doc.data(),
              created_at: createdAtDate,
            });
          });
          // console.log(newData);
          dispatch({ type: "SET_TIMERS", payload: newData });
          setIsLoading(false);
        } else {
          dispatch({ type: "SET_TIMERS", payload: null });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user, dispatch]);

  const onCalendarAfterFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["created_at"].constraints[0].value = value;

    setFilters(_filters);
    setStartDate(value);
  };

  const onCalendarBeforeFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["created_at"].constraints[1].value = value;

    setFilters(_filters);
    setEndDate(value);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _timer = { ...timer };

    _timer[`${name}`] = val;

    setTimer(_timer);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value || "";
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const editTimer = async (timer) => {
    setTimer({ ...timer });
    setEditDialog(true);
  };

  const deleteTimer = async (timer) => {
    setTimer({ ...timer });
    setDeleteDialog(true);
  };

  const handleEdit = async () => {
    if (!user) {
      return;
    }
    try {
      if (user.uid === timer.user_uid) {
        const updateDocRef = doc(db, "timers", timer.id);
        await updateDoc(updateDocRef, {
          description: timer.description,
        });
        dispatch({
          type: "UPDATE_TIMER",
          payload: { id: timer.id, newDescription: timer.description },
        });
        console.log("Timer is updated!" + timer.id);
      } else {
        console.log("You are not authorized to update this document.");
      }
      setEditDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    try {
      if (user.uid === timer.user_uid) {
        await deleteDoc(doc(db, "timers", timer.id));
        console.log(`Document with ID: ${timer.id} is deleted!`);
        dispatch({ type: "DELETE_TIMER", payload: timer.id });
      } else {
        console.log("You are not authorized to delete this document.");
      }
      setDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col max-w-[1170px] gap-4 py-10 mx-auto">
      <h1 className="text-[24px] font-[700]">Trackers History</h1>
      <div>
        <HistoryTable
          isLoading={isLoading}
          editTimer={editTimer}
          deleteTimer={deleteTimer}
          startDate={startDate}
          onCalendarAfterFilterChange={onCalendarAfterFilterChange}
          endDate={endDate}
          onCalendarBeforeFilterChange={onCalendarBeforeFilterChange}
          globalFilterValue={globalFilterValue}
          onGlobalFilterChange={onGlobalFilterChange}
          filters={filters}
          timers={timers}
        />
      </div>
      <EditDialog
        editDialog={editDialog}
        timer={timer}
        setEditDialog={setEditDialog}
        onInputChange={onInputChange}
        handleEdit={handleEdit}
      />
      <DeleteDialog
        deleteDialog={deleteDialog}
        setDeleteDialog={setDeleteDialog}
        handleDelete={handleDelete}
      />
    </main>
  );
}
