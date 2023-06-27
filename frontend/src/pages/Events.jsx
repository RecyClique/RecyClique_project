import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import * as BulmaToast from "bulma-toast";
import EventForm from "../components/EventForm";
import { getAllEvents } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import { joinEvent, listAllJoined } from "../adapters/user-adapter";
// import Modal from "../adapters/components";

const Events = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    currentUser ? setIsModalOpen(true) : navigate('/login');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  const eventClick = async (event) => {
    if (!currentUser) navigate("/login");

    const options = {
      userId: currentUser.id,
      eventId: event.id,
    };

    try {
      await joinEvent(options);

      BulmaToast.toast({
        message: `Successfully joined the event!`,
        type: "is-success",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });

      // Reload to reflect the changes.
      window.location.reload();
    } catch (error) {
      BulmaToast.toast({
        message: `Failed to join the event.`,
        type: "is-danger",
        position: "top-center",
        dismissible: true,
        pauseOnHover: true,
      });
      console.error("Error joining event:", error);
    }
  }; 

  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAllEvents().then(setEvents);
  }, []);
  const [joined, setJoined] = useState(new Set());
  useEffect(() => {
    const joinedChecker = async () => {
      const result = await listAllJoined(currentUser.id);
      const options = result[0];
      const eventsJoined = new Set();
      for (const event of options) {
        eventsJoined.add(event.id);
      }
      setJoined(eventsJoined);
    };
    joinedChecker();
  }, [currentUser]);

  // const joinedChecker = async () => {
  //   const result = await listAllJoined(currentUser.id);
  //   const options = result[0]
  //   const eventsJoined = new Set();
  //   for (let event of options) {
  //     eventsJoined.add(event.id)
  //     // console.log('TEST' + event.id)
  //   }
  //   // console.log(eventsJoined)
  //   return eventsJoined;
  // }
  // let joined;
  // const eventChecker = async () => {
  //   joined = await joinedChecker();
  // }
  // eventChecker();

  // function MyComponent() {
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  //   const openModal = () => {
  //     setIsModalOpen(true);
  //   };

  //   const closeModal = () => {
  //     setIsModalOpen(false);
  //   };

  return (
    <>
      <div>
        <h1 className='title has-text-centered'>Events</h1>
        <div className='is-flex is-justify-content-center mb-5'>
          <button className='button' onClick={openModal}>Create Event</button>
        </div>
        <div>
          {
            events.map((event) => {
              if (currentUser) {
                return (
                  joined.has(event.id) === false && Number(event.organizer_id) !== Number(currentUser.id) ? <>
                    <div className='box eventBox' id={`eventId: ${event.id}`}>
                      <div>
                        <h1 className='title'>{event.title}</h1>
                        <p>{event.borough}</p>
                        <p>{event.location}</p>
                        <p>{event.start_date === event.end_date ? event.start_date.substring(0, 10) : `${event.start_date.substring(0, 10)} - ${event.end_date.substring(0, 10)}`}</p>
                        <p>{`${event.start_time} - ${event.end_time}`}</p>
                      </div>
                      <div className='cardSec2'>
                        <button className='button is-primary' onClick={() => eventClick(event)}>Join Event</button>
                      </div>
                      <div>
                        {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                        {/* <p>{event.description}</p> */}
                        <div>
                          <details>
                            <summary>Description</summary>
                            <p>{event.description}</p>
                          </details>
                        </div>

                        <figure className="image is-128x128">
                          <img src="https://bulma.io/images/placeholders/128x128.png"/>
                        </figure>

                      </div>
                    </div>
                  </> : null);
              }

              return (
                <>
                  <div className="box eventBox" id={`eventId: ${event.id}`}>
                    <div>
                      <h1 className="title">{event.title}</h1>
                      <p>{event.borough}</p>
                      <p>{event.location}</p>
                      <p>
                        {event.start_date === event.end_date
                          ? event.start_date.substring(0, 10)
                          : `${event.start_date.substring(
                            0,
                            10,
                          )} - ${event.end_date.substring(0, 10)}`}
                      </p>
                      <p>{`${event.start_time} - ${event.end_time}`}</p>
                    </div>
                    <div className="cardSec2">
                      <button
                        className="button is-primary"
                        onClick={() => eventClick(event)}
                      >
                        Join Event
                      </button>
                    </div>
                    <div>
                      <h1 className="is-size-5 has-text-weight-bold mt-4">
                        Description
                      </h1>
                      <p>{event.description}</p>
                      <button onClick={openModal}>Description</button>
                      <img src={event.image} alt="Event" />
                    </div>
                  </div>
                </>
              );
            })
          }
        </div>
      </div>
      <EventForm isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Events;
