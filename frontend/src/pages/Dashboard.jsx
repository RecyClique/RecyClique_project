import { useContext, useEffect, useState } from "react";
import * as BulmaToast from "bulma-toast";
import { listAllCreated, listAllJoined, leavePost } from "../adapters/user-adapter";
import { deleteEvent } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [joined, setJoined] = useState(null);
  const [created, setCreated] = useState(null);
  const [toggle, setToggle] = useState(1)
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [
        listAllCreated(currentUser.id),
        listAllJoined(currentUser.id),
      ];

      const [result1, result2] = await Promise.all(promises);
      setJoined(result2);
      setCreated(result1);
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser, toggle]);

  const changeTab = (index) => {
    setCurrentTab(index);
  };

  const leaveEventButton = async (eventId) => {
    const [response, error] = await leavePost(currentUser.id, eventId);

    if (error) {
      BulmaToast.toast({
        message: `Something went wrong while trying to leave the event.`,
        type: "is-danger",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      console.error("Error leaving event:", error);
    } else {
      BulmaToast.toast({
        message: `You have successfully left the event!`,
        type: "is-success",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      console.log("Successfully left event:", response);
    }
    setToggle(toggle + 1);
  };

  const deleteEventButton = async (eventId) => {
    const [response, error] = await deleteEvent(eventId);

    if (error) {
      BulmaToast.toast({
        message: `Something went wrong while deleting the event.`,
        type: "is-danger",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      console.error("Error deleting event:", error);
    } else {
      BulmaToast.toast({
        message: `Successfully deleted the event!`,
        type: "is-success",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      console.log("Successfully deleted event:", response);
    }
    setToggle(toggle + 1);
  };

  function convertToUSTime(militaryTime) {
    const timeComponents = militaryTime.split(':');
    let hours = parseInt(timeComponents[0]);
    let minutes = parseInt(timeComponents[1]);
    let period = "AM";
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }
    const usTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
    return usTime;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div style={{ background: 'var(--background)', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', padding: '10px', color: 'var(--primary)' }}>Dashboard</h1>
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div className="tabs is-centered">
          <ul>
            <li className={currentTab === 0 ? 'is-active' : ''} onClick={() => changeTab(0)}>
              <a>Joined Events</a>
            </li>
            <li className={currentTab === 1 ? 'is-active' : ''} onClick={() => changeTab(1)}>
              <a>Created Events</a>
            </li>
          </ul>
        </div>
        {currentTab === 0 ? (
          <div className="box">
            {joined?.length === 0 && (
              <h1 style={{ textAlign: 'center', color: 'var(--primary)' }}>You have not joined any events</h1>
            )}
            {joined?.map((event, index) => (
              <div key={index} className="card" style={{ marginBottom: '10px' }}>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48">
                        <img src={event.imageUrl} alt="Placeholder image" />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{event.title}</p>
                      <p className="subtitle is-6">{formatDate(event.date)}</p>
                      <p className="subtitle is-6">{convertToUSTime(event.time)}</p>
                    </div>
                  </div>

                  <div className="content">
                    {event.description}
                    <br />
                  </div>
                  <button className="button is-danger" onClick={() => leaveEventButton(event.id)}>
                    Leave Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="box">
            {created?.length === 0 && (
              <h1 style={{ textAlign: 'center', color: 'var(--primary)' }}>You have not created any events</h1>
            )}
            {created?.map((event, index) => (
              <div key={index} className="card" style={{ marginBottom: '10px' }}>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48">
                        <img src={event.imageUrl} alt="Placeholder image" />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{event.title}</p>
                      <p className="subtitle is-6">{formatDate(event.date)}</p>
                      <p className="subtitle is-6">{convertToUSTime(event.time)}</p>
                    </div>
                  </div>

                  <div className="content">
                    {event.description}
                    <br />
                  </div>
                  <button className="button is-danger" onClick={() => deleteEventButton(event.id)}>
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
