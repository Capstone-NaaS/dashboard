import { deadLog } from "../types";

export const fetchDlq = async (
  setDeadLogs: React.Dispatch<React.SetStateAction<deadLog[]>>
): Promise<void> => {
  const apiUrl: string = import.meta.env.VITE_HTTP_GATEWAY;
  const API_KEY: string = import.meta.env.VITE_API_KEY;
  try {
    let response = await fetch(`${apiUrl}/dlq`, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    });
    const fetchedDlq = (await response.json()) as string[];
    setDeadLogs(fetchedDlq.map((log) => JSON.parse(log)));
  } catch (error) {
    console.error("error fetching dlq: ", error);
  }
};

export const COLORS = {
  on: "#66BB6A",
  off: "#E57373",
  all: "#B0BEC5",
  exclude: "#B0BEC5",
  button: "purple",
};
