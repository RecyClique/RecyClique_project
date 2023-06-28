import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";

import { getAllEvents } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import { joinEvent, listAllJoined } from "../adapters/user-adapter";// import Modal from "../adapters/components";
import "../index.css";

const Events = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState(1)

  const openModal = () => {
    currentUser ? setIsModalOpen(true) : navigate('/login');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  const eventClick = async (event) => {
    if (!currentUser) navigate('/login');
    const options = {
      userId: currentUser.id,
      eventId: event.id,
    };
    await joinEvent(options);
    setToggle(toggle + 1)
  };

  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAllEvents().then(setEvents);
    console.log(events)
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
  }, [currentUser, toggle]);

  function convertToUSTime(militaryTime) {
    // Split the military time into hours and minutes
    const timeComponents = militaryTime.split(':');
    let hours = parseInt(timeComponents[0]);
    let minutes = parseInt(timeComponents[1]);

    // Determine the period (AM/PM)
    let period = "AM";
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }

    // Format the time in 12-hour AM/PM format
    const usTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;

    return usTime;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <>
      <div style={{ background: '#344d41', minHeight: '75vh' }} >
        <h1 className='title has-text-centered' style={{ color: 'white', padding: '40px 20px 20px 20px' }}>Events</h1>
        <div className='is-flex is-justify-content-center mb-5'>
          <button className='button' onClick={openModal} style={{ background: '#344d41', color: 'white', border: '2px solid #fff', borderRadius: '0px' }}>Create Event</button>
        </div>
        <div className='grid-container'>
          {
            events.map((event) => {
              if (currentUser) {
                return (
                  joined.has(event.id) === false && Number(event.organizer_id) !== Number(currentUser.id) && toggle ? <>
                  <div className='box eventBox my-5 eventCardHover' id={`eventId: ${event.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <div className='eventCard' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                    <p className='has-text-weight-bold is-size-6 pb-4'>{event.username}</p>
                      <figure className="image" style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                        <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </figure>
                      <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px' }}>{event.title}</h1>
                      <p className='has-text-weight-bold'>{event.type}</p>
                      <div>
                        <p>{`${convertToUSTime(event.start_time)} - ${convertToUSTime(event.end_time)}`}</p>
                        <p>{event.start_date === event.end_date ? formatDate(event.start_date.substring(0, 10)) : `${formatDate(event.start_date.substring(0, 10))} - ${formatDate(event.end_date.substring(0, 10))}`}</p>
                      </div>
                      <p style={{ color: '#9f9f9f' }}>{event.location}</p>
                      <p style={{ color: '#9f9f9f' }}>{event.borough}, NY</p>
                      <details style={{}}>
                        <summary style={{ cursor: 'pointer' }}>Description</summary>
                        <p>{event.description}</p>
                      </details>
                    </div>
                    <div className='cardSec2'>
                      <button className='button my-3' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => eventClick(event)}>Join Event</button>
                    </div>
                    <div>
                      {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                      {/* <p>{event.description}</p> */}
                    </div>
                  </div>
                </> : null);
              }

              return (
                toggle ? <>
                  <div className='box eventBox my-5 eventCardHover' id={`eventId: ${event.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <div className='eventCard' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                    <p className='has-text-weight-bold is-size-6 pb-4'>{event.username}</p>
                      <figure className="image" style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                        <img src={event.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </figure>
                      <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px' }}>{event.title}</h1>
                      <p className='has-text-weight-bold'>{event.type}</p>
                      <div>
                        <p>{`${convertToUSTime(event.start_time)} - ${convertToUSTime(event.end_time)}`}</p>
                        <p>{event.start_date === event.end_date ? formatDate(event.start_date.substring(0, 10)) : `${formatDate(event.start_date.substring(0, 10))} - ${formatDate(event.end_date.substring(0, 10))}`}</p>
                      </div>
                      <p style={{ color: '#9f9f9f' }}>{event.location}</p>
                      <p style={{ color: '#9f9f9f' }}>{event.borough}, NY</p>
                      <details style={{}}>
                        <summary style={{ cursor: 'pointer' }}>Description</summary>
                        <p>{event.description}</p>
                      </details>
                    </div>
                    <div className='cardSec2'>
                      <button className='button my-3' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => eventClick(event)}>Join Event</button>
                    </div>
                    <div>
                      {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                      {/* <p>{event.description}</p> */}
                    </div>
                  </div>
                </> : <></>
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