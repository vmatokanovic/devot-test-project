import { createContext, useReducer, useContext } from "react";

export const TimersContext = createContext();

export const timersReducer = (state, action) => {
  switch (action.type) {
    case "SET_TIMERS":
      return {
        timers: action.payload,
      };
    case "CREATE_TIMER":
      return {
        timers: [action.payload, ...state.timers],
      };
    case "UPDATE_TIMER":
      return {
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, description: action.payload.newDescription }
            : timer
        ),
      };
    case "UPDATE_TIMER_SECONDS":
      return {
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, seconds: action.payload.newSeconds }
            : timer
        ),
      };
    case "DELETE_TIMER":
      return {
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      };
    case "DELETE_ALL_TIMERS":
      return {
        timers: [],
      };

    default:
      return state;
  }
};

export const TimersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timersReducer, {
    timers: null,
  });

  return (
    <TimersContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TimersContext.Provider>
  );
};

export const useTimersContext = () => {
  return useContext(TimersContext);
};
