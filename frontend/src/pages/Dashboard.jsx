import { useContext, useEffect, useState } from "react";
import * as BulmaToast from "bulma-toast";
import { listAllCreated, listAllJoined, leavePost } from "../adapters/user-adapter";
import { deleteEvent } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [joined, setJoined] = useState(null);
  const [created, setCreated] = useState(null);

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
      // Ensure currentUser is defined before running fetchData.
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(created ? created[0] : null);
    console.log(joined ? joined[0] : null);
  }, [created, joined]);

  const [currentTab, setCurrentTab] = useState(0);
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

      // We fetch the data again to update the events lists.
      fetchData();
    }
  };

  return (
    <>
      <div>
        <h1 className="title has-text-centered">Dashboard</h1>
      </div>

      <div className="tabs is-centered">
        <ul>
          <li className={currentTab === 0 ? "is-active" : ""} onClick={() => changeTab(0)}><a>Joined Events</a></li>
          <li className={currentTab === 2 ? "is-active" : ""} onClick={() => changeTab(2)}><a>Created Events</a></li>
        </ul>
      </div>
      <div className="tab-content">
        <div className={currentTab !== 0 ? "is-hidden" : ""}>

        {
            joined ? joined[0].map((joinedEvent) => {
              console.log(`result2${joinedEvent}`);
              return (
                <>
                  <div className='box eventBox' id={`eventId: ${joinedEvent.id}`}>
                      <div>
                        <h1 className='title'>{joinedEvent.title}</h1>
                        <p>{joinedEvent.borough}</p>
                        <p>{joinedEvent.location}</p>
                        <p>{joinedEvent.start_date === joinedEvent.end_date ? joinedEvent.start_date.substring(0, 10) : `${joinedEvent.start_date.substring(0, 10)} - ${joinedEvent.end_date.substring(0, 10)}`}</p>
                        <p>{`${joinedEvent.start_time} - ${joinedEvent.end_time}`}</p>
                      </div>
                      <div className='cardSec2'>
                        <button className='button is-danger' onClick={() => leaveEventButton(joinedEvent.id)}>Leave Event</button>
                      </div>
                      <div>
                        <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1>
                        <p>{joinedEvent.description}</p>
                      </div>
                    </div>
                </>
              );
            }) : 'NAY'
          }
        </div>
        {/* <div className={currentTab !== 1 ? "is-hidden" : ""}>
          <p>test2</p>
        </div> */}
        <div className={currentTab !== 2 ? "is-hidden" : ""}>
          {
            created ? created[0].map((createdEvent) => {
              const {
                id,
                borough,
                location,
                start_date,
                start_time,
                end_date,
                end_time,
                description,
                title,
              } = createdEvent;
              return (
                <div className='box eventBox' key={`eventId: ${id}`}>
                      <div>
                        <h1 className='title'>{title}</h1>
                        <p>{borough}</p>
                        <p>{location}</p>
                        <p>{start_date === end_date ? start_date.substring(0, 10) : `${start_date.substring(0, 10)} - ${end_date.substring(0, 10)}`}</p>
                        <p>{`${start_time} - ${end_time}`}</p>
                      </div>
                      <div className='cardSec2'>
                        <button className='button is-primary' onClick={() => deleteEventButton(id)}>Delete Event</button>
                      </div>
                      <div>
                        <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1>
                        <p>{description}</p>
                      </div>
                    </div>
              );
            }) : 'NAY'
          }
        </div>
      </div>
    </>
  );
};

export default Dashboard;
