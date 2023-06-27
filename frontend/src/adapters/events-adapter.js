import { fetchHandler, deleteOptions } from "../utils";

const baseUrl = "/api/events";

export const createEvent = async (formData) => {
  const options = {
    method: "POST",
    body: formData,
  };

  try {
    const response = await fetch(baseUrl, options);
    if (!response.ok) throw new Error("Error creating event");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllEvents = async () => {
  const [events] = await fetchHandler(baseUrl);
  return events || [];
};

export const deleteEvent = async (eventId) => {
  const result = await fetchHandler(`${baseUrl}/${eventId}`, deleteOptions);
  return result;
};