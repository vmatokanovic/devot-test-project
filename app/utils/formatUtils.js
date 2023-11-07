const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatDate = (value) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const [month, day, year] = value
    .toLocaleDateString("en-US", options)
    .split("/");

  const formattedDate = `${day}.${month}.${year}.`;
  return formattedDate;
};

export { formatTime, formatDate };
