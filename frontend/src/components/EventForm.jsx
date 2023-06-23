import { useContext } from "react";
import { createEvent } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";

const EventForm = ({ isOpen, onClose }) => {
  const { currentUser } = useContext(CurrentUserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append("organizer_id", currentUser.id);
    if (!formData.get("image")) {
      formData.append("image", "");
    }

    e.target.reset();
    onClose();

    const result = await createEvent(formData);
    console.log("result", result);
  };

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create an Event</p>
          <button
            className="delete"
            onClick={onClose}
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          <form id="eventForm" onSubmit={handleSubmit}>
            <div className="field">
              <label>Type</label>
              <div className="select">
                <select name="type" required>
                  <option>Cleanup</option>
                  <option>Exchange</option>
                </select>
              </div>
              <label htmlFor="eventFormTitle">Title</label>
              <input
                className="input"
                name="title"
                id="eventFormTitle"
                type="text"
                required
              ></input>
              <label htmlFor="description">Description</label>
              <textarea
                className="textarea"
                id="description"
                name="description"
                placeholder="e.g. Provide details about your event here!"
                required
              ></textarea>
              <label htmlFor="start_date">Select start date:</label>
              <input
                type="date"
                id="startDate"
                name="start_date"
                required
              ></input>
              <label htmlFor="start_time">Select start time:</label>
              <input
                type="time"
                id="startTime"
                name="start_time"
                required
              ></input>
              <label htmlFor="end_date">Select end date:</label>
              <input type="date" id="endDate" name="end_date" required></input>
              <label htmlFor="end_time">Select end time:</label>
              <input type="time" id="endTime" name="end_time" required></input>
              <label htmlFor="eventFormLocation">Location</label>
              <input
                className="input"
                name="location"
                id="eventFormLocation"
                type="text"
                placeholder="123 Address str, 12345"
                required
              ></input>
              <label htmlFor="borough">Borough</label>
              <div className="select">
                <select name="borough" id="borough" required>
                  <option>Manhattan</option>
                  <option>Brooklyn</option>
                  <option>The Bronx</option>
                  <option>Queens</option>
                  <option>Staten Island</option>
                </select>
              </div>
              <label htmlFor="image">Event image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
              ></input>
            </div>
            <footer className="modal-card-foot">
              <button className="button" form="eventForm" type="submit">
                Publish
              </button>
              <button className="button" onClick={onClose}>
                Cancel
              </button>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EventForm;
