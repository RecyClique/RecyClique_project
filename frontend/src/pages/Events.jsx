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
    window.location.reload();
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
      <div style={{ background: '#344d41' }} >
        <h1 className='title has-text-centered' style={{ color: 'white', padding: '20px' }}>Events</h1>
        <div className='is-flex is-justify-content-center mb-5'>
          <button className='button' onClick={openModal} style={{ background: '#344d41', color: 'white', border: '2px solid #fff', borderRadius: '0px' }}>Create Event</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
          {
            events.map((event) => {
              if (currentUser) {
                return (
                  joined.has(event.id) === false && Number(event.organizer_id) !== Number(currentUser.id) ? <>
                    <div className='box eventBox' id={`eventId: ${event.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column', width: '20%' }}>
                      <div className='eventCard'>
                      <figure className="image" style={{ width: '100%' }}>
                          <img src={event.image}/>
                      </figure>
                        <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px'}}>{event.title}</h1>
                        <div>
                        <p>{`${event.start_time} - ${event.end_time}`}</p>
                        <p>{event.start_date === event.end_date ? event.start_date.substring(0, 10) : `${event.start_date.substring(0, 10)} - ${event.end_date.substring(0, 10)}`}</p>
                        </div>
                        <p style={{ color: '#9f9f9f' }}>{event.location}</p>
                        <p style={{ color: '#9f9f9f' }}>{event.borough}, NY</p>
                          <details style={{ }}>
                            <summary style={{ cursor: 'pointer'}}>Description</summary>
                            <p>{event.description}</p>
                          </details>
                      </div>
                      <div className='cardSec2'>
                        <button className='button' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => eventClick(event)}>Join Event</button>
                      </div>
                      <div>
                        {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                        {/* <p>{event.description}</p> */}
                      </div>
                    </div>
                  </> : null);
              }

              return (
                <>
                    <div className='box eventBox' id={`eventId: ${event.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column' }}>
                      <div className='eventCard'>
                      <figure className="image" style={{ width: '100%' }}>
                          <img src={event.image}/>
                      </figure>
                        <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px'}}>{event.title}</h1>
                        <div>
                        <p>{`${event.start_time} - ${event.end_time}`}</p>
                        <p>{event.start_date === event.end_date ? event.start_date.substring(0, 10) : `${event.start_date.substring(0, 10)} - ${event.end_date.substring(0, 10)}`}</p>
                        </div>
                        <p style={{ color: '#9f9f9f' }}>{event.location}</p>
                        <p style={{ color: '#9f9f9f' }}>{event.borough}, NY</p>
                          <details style={{ }}>
                            <summary style={{ cursor: 'pointer'}}>Description</summary>
                            <p>{event.description}</p>
                          </details>
                      </div>
                      <div className='cardSec2'>
                        <button className='button' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => eventClick(event)}>Join Event</button>
                      </div>
                      <div>
                        {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                        {/* <p>{event.description}</p> */}
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