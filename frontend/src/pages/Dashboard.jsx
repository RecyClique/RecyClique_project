import { listAllCreated, listAllJoined, leavePost } from "../adapters/user-adapter"
import { deleteEvent } from "../adapters/events-adapter";
import * as BulmaToast from "bulma-toast";
import CurrentUserContext from "../contexts/current-user-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [joined, setJoined] = useState(null);
  const [created, setCreated] = useState(null);
  const [toggle, setToggle] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

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
  }, [currentUser, toggle]);

  useEffect(() => {
  }, [created, joined]);

  const [currentTab, setCurrentTab] = useState(0);
  const changeTab = (index) => {
    setCurrentTab(index)
  }

  const leaveEventButton = async (eventId) => {
    await leavePost(currentUser.id, eventId);

    // Show a success message
    BulmaToast.toast({
      message: `Successfully left the event!`,
      type: "is-success",
      position: "top-center",
      dismissible: true,
      pauseOnHover: true,
    });

    setToggle(toggle + 1)
  }


  const deleteEventButton = async (eventId) => {
    await deleteEvent(eventId);

    // Show a success message
    BulmaToast.toast({
      message: `Event deleted successfully!`,
      type: "is-success",
      position: "top-center",
      dismissible: true,
      pauseOnHover: true,
    });

    setToggle(toggle + 1)
  }

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
    <div style={{ background: '#344d41', minHeight: '75vh', padding: '40px' }}>
      <div style={{ padding: '20px' }}>
        {currentUser &&
          <h1 className="title has-text-centered has-text-white py-4">Welcome, {currentUser.first_name} {currentUser.last_name}!</h1>
        }
      </div>



      <div className="tabs is-centered">
        <ul>
          <li className={currentTab === 0 ? "is-active tab-item" : "tab-item"} onClick={() => changeTab(0)}><a>Joined Events</a></li>
          <li className={currentTab === 2 ? "is-active tab-item" : "tab-item"} onClick={() => changeTab(2)}><a>Created Events</a></li>
        </ul>
      </div>
      <div className="tab-content">
        <div className={currentTab !== 0 ? "is-hidden grid-container" : "grid-container"}>

          {
            joined && toggle ? joined[0].map(joinedEvent => {
              const { id, username, image, title, type, start_time, end_time, start_date, end_date, location, borough, description } = joinedEvent;
              return (
                <>
                  <div className='box eventBox my-5 eventCardHover' key={`eventId: ${id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <div className='eventCard' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
                      <p className='has-text-weight-bold is-size-6 pb-4'>{username}</p>
                      <figure className="image" style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                        <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </figure>
                      <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px' }}>{title}</h1>
                      <p className='has-text-weight-bold'>{type}</p>
                      <div>
                        <p>{`${convertToUSTime(start_time)} - ${convertToUSTime(end_time)}`}</p>
                        <p>{start_date === end_date ? formatDate(start_date.substring(0, 10)) : `${formatDate(start_date.substring(0, 10))} - ${formatDate(end_date.substring(0, 10))}`}</p>
                      </div>
                      <p style={{ color: '#9f9f9f' }}>{location}</p>
                      <p style={{ color: '#9f9f9f' }}>{borough}, NY</p>
                      <details style={{}}>
                        <summary style={{ cursor: 'pointer' }}>Description</summary>
                        <p>{description}</p>
                      </details>
                    </div>
                    <div className='cardSec2'>
                      <button className='button my-3' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => leaveEventButton(id)}>Leave Event</button>
                    </div>
                    <div>
                    </div>
                  </div>
                </>
              )
            }) : 'NAY'
          }
        </div>
        <div className={currentTab !== 2 ? "is-hidden grid-container" : "grid-container"}>
          {
            created && toggle ? created[0].map(createdEvent => {
              const { id, username, image, title, type, start_time, end_time, start_date, end_date, location, borough, description } = createdEvent;
              return (
                <>
                  <div className='box eventBox my-5 eventCardHover' id={`eventId: ${id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column' }}>
                    <div className='eventCard' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%' }}>
                      <figure className="image" style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                        <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </figure>
                      <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px' }}>{title}</h1>
                      <p className='has-text-weight-bold'>{type}</p>
                      <div>
                        <p>{`${convertToUSTime(start_time)} - ${convertToUSTime(end_time)}`}</p>
                        <p>{start_date === end_date ? formatDate(start_date.substring(0, 10)) : `${formatDate(start_date.substring(0, 10))} - ${formatDate(end_date.substring(0, 10))}`}</p>
                      </div>
                      <p style={{ color: '#9f9f9f' }}>{location}</p>
                      <p style={{ color: '#9f9f9f' }}>{borough}, NY</p>
                      <details style={{}}>
                        <summary style={{ cursor: 'pointer' }}>Description</summary>
                        <p>{description}</p>
                      </details>
                    </div>
                    <div className='cardSec2'>
                      <button className='button my-3' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => deleteEventButton(id)}>Delete Event</button>
                    </div>
                  </div>
                </>
              )
            }) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard