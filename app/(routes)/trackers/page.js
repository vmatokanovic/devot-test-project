"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTimersContext } from "@/app/context/TimerContext";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase";

// Primereact imports
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import TrackersTable from "@/app/components/TrackersTable";
import AddDialog from "@/app/components/addDialog";
import StopDialog from "@/app/components/StopDialog";
import EditDialog from "@/app/components/EditDialog";
import DeleteDialog from "@/app/components/DeleteDialog";

export default function Trackers() {
  const { user } = useAuth();
  const { timers, dispatch } = useTimersContext();
  const router = useRouter();

  const toast = useRef(null);

  let emptyTimer = {
    id: null,
    user_uid: null,
    seconds: 0,
    description: "",
    finished: false,
    created_at: null,
  };

  const current = new Date();
  const date = `${current.getDate()}.${
    current.getMonth() + 1
  }.${current.getFullYear()}.`;

  const [isLoading, setIsLoading] = useState(true);
  const [trackerDescription, setTrackerDescription] = useState("");

  // Timer states
  const [timerOn, setTimerOn] = useState(false);
  const [timer, setTimer] = useState(emptyTimer);
  const [activeTimer, setActiveTimer] = useState(emptyTimer);
  const [activeTimerId, setActiveTimerId] = useState(null);

  // Dialog states
  const [addDialog, setAddDialog] = useState(false);
  const [stopDialog, setStopDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    let interval = null;
    if (timerOn && activeTimerId !== null) {
      interval = setInterval(() => {
        const updatedTimer = {
          ...activeTimer,
          seconds: activeTimer.seconds + 1,
        };
        setActiveTimer(updatedTimer);
        dispatch({
          type: "UPDATE_TIMER_SECONDS",
          payload: { id: updatedTimer.id, newSeconds: updatedTimer.seconds },
        });

        if (updatedTimer.seconds % 60 === 0) {
          updateTimerPeriodically(updatedTimer);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerOn, activeTimer, activeTimerId, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const q = query(
            collection(db, "timers"),
            where("user_uid", "==", user.uid),
            where("finished", "==", false)
          );
          const querySnapshot = await getDocs(q);

          const newData = [];

          querySnapshot.forEach((doc) => {
            newData.push({ id: doc.id, ...doc.data() });
          });

          console.log(newData);
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

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _timer = { ...timer };
    _timer[`${name}`] = val;
    setTimer(_timer);
  };

  const startTimer = async (timer) => {
    if (timer.id === activeTimerId) {
      const updateDocRef = doc(db, "timers", timer.id);
      await updateDoc(updateDocRef, {
        seconds: timer.seconds,
      });
      setTimerOn(false);
      setActiveTimerId(null);
    } else if (activeTimerId !== null) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Only one timer can work at a time. Stop that timer before you start another one.",
      });
    } else {
      setActiveTimer({ ...timer });
      setActiveTimerId(timer.id);
      setTimerOn(true);
    }
  };

  const stopTimer = async (timer) => {
    setTimer({ ...timer });
    setStopDialog(true);
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
        if (timer.id === activeTimerId) {
          setTimerOn(false);
          setActiveTimerId(null);
        }
      } else {
        console.log("You are not authorized to delete this document.");
      }
      setDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStop = async () => {
    const updateDocRef = doc(db, "timers", timer.id);
    await updateDoc(updateDocRef, {
      seconds: timer.seconds,
      finished: true,
    });
    dispatch({ type: "DELETE_TIMER", payload: timer.id });
    if (timer.id === activeTimerId) {
      setTimerOn(false);
      setActiveTimerId(null);
    }
    setStopDialog(false);
  };

  const handleAddNew = async () => {
    if (!user) {
      return;
    }
    try {
      const newTimer = {
        user_uid: user.uid,
        description: trackerDescription,
        seconds: 0,
        finished: false,
        created_at: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "timers"), newTimer);
      console.log("Document written with ID: ", docRef.id);
      newTimer.id = docRef.id;
      dispatch({ type: "CREATE_TIMER", payload: newTimer });
      setTrackerDescription("");
      setAddDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const stopAllTimers = async () => {
    if (timers && timers.length > 0) {
      try {
        const updatePromises = timers.map(async (timer) => {
          const { id, seconds } = timer;
          const updateDocRef = doc(db, "timers", id);
          await updateDoc(updateDocRef, {
            seconds: seconds,
            finished: true,
          });
          return id;
        });
        const updatedTimerIds = await Promise.all(updatePromises);
        dispatch({ type: "DELETE_ALL_TIMERS", payload: updatedTimerIds });
        setTimerOn(false);
        setActiveTimerId(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateTimerPeriodically = async (updatedTimer) => {
    try {
      const updateDocRef = doc(db, "timers", updatedTimer.id);
      await updateDoc(updateDocRef, {
        seconds: updatedTimer.seconds,
      });
      console.log("Timer synced with database.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col gap-5 py-10 max-w-[1170px] mx-auto">
      <Toast ref={toast} />
      <div className="flex flex-row gap-2 items-center">
        <i className="pi pi-calendar" style={{ fontSize: "25px" }}></i>
        <h1 className="text-[24px] font-[700]">Today ({date})</h1>
      </div>

      <div className="flex flex-row justify-end gap-4 h-[36px]">
        <Button
          onClick={() => setAddDialog(true)}
          label="Start new timer"
          icon="pi pi-stopwatch"
        />
        <Button
          onClick={stopAllTimers}
          label="Stop all"
          icon="pi pi-stop-circle"
          severity="secondary"
        />
      </div>
      <TrackersTable
        timers={timers}
        activeTimerId={activeTimerId}
        isLoading={isLoading}
        startTimer={startTimer}
        stopTimer={stopTimer}
        editTimer={editTimer}
        deleteTimer={deleteTimer}
      />
      <AddDialog
        addDialog={addDialog}
        setAddDialog={setAddDialog}
        trackerDescription={trackerDescription}
        setTrackerDescription={setTrackerDescription}
        handleAddNew={handleAddNew}
      />
      <StopDialog
        stopDialog={stopDialog}
        setStopDialog={setStopDialog}
        handleStop={handleStop}
      />
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
