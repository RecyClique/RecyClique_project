import { listAllCreated, listAllJoined, leavePost } from "../adapters/user-adapter"
import { deleteEvent } from "../adapters/events-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import { useContext, useEffect, useState } from "react";
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
    setCurrentTab(index)
  }

  const leaveEventButton = async (eventId) => {
    await leavePost(currentUser.id, eventId);
    window.location.reload()
  }

  const deleteEventButton = async (eventId) =>{
    await deleteEvent(eventId);
    window.location.reload();
  }

  return (
    <>
      <div>
        <h1 className="title has-text-centered">Dashboard</h1>
      </div>



      <div className="tabs is-centered">
        <ul>
          <li className={currentTab === 0 ? "is-active" : ""} onClick={() => changeTab(0)}><a>Joined Events</a></li>
          {/* <li className={currentTab === 1 ? "is-active" : ""} onClick={() => changeTab(1)}><a>Past Events</a></li> */}
          <li className={currentTab === 2 ? "is-active" : ""} onClick={() => changeTab(2)}><a>Created Events</a></li>
        </ul>
      </div>
      <div className="tab-content">
        <div className={currentTab !== 0 ? "is-hidden" : ""} style={{display:'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
           
        {
            joined ? joined[0].map(joinedEvent => {
              console.log('result2' + joinedEvent)
              return (
                <>
                    <div className='box eventBox' id={`eventId: ${joinedEvent.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column' }}>
                      <div className='eventCard'>
                      <figure className="image" style={{ width: '100%' }}>
                          <img src={joinedEvent.image}/>
                      </figure>
                        <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px'}}>{joinedEvent.title}</h1>
                        <div>
                        <p>{`${joinedEvent.start_time} - ${joinedEvent.end_time}`}</p>
                        <p>{joinedEvent.start_date === joinedEvent.end_date ? joinedEvent.start_date.substring(0, 10) : `${joinedEvent.start_date.substring(0, 10)} - ${joinedEvent.end_date.substring(0, 10)}`}</p>
                        </div>
                        <p style={{ color: '#9f9f9f' }}>{joinedEvent.location}</p>
                        <p style={{ color: '#9f9f9f' }}>{joinedEvent.borough}, NY</p>
                          <details style={{ }}>
                            <summary style={{ cursor: 'pointer'}}>Description</summary>
                            <p>{joinedEvent.description}</p>
                          </details>
                      </div>
                      <div className='cardSec2'>
                        <button className='button' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => leaveEventButton(joinedEvent.id)}>Leave Event</button>
                      </div>
                      <div>
                        {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                        {/* <p>{event.description}</p> */}
                      </div>
                    </div>
                  </>
                // <>
                //   <div className='box eventBox' id={'eventId: ' + joinedEvent.id}>
                //       <div>
                //         <h1 className='title'>{joinedEvent.title}</h1>
                //         <p>{joinedEvent.borough}</p>
                //         <p>{joinedEvent.location}</p>
                //         <p>{joinedEvent.start_date === joinedEvent.end_date ? joinedEvent.start_date.substring(0, 10) : joinedEvent.start_date.substring(0, 10) + ' - ' + joinedEvent.end_date.substring(0, 10)}</p>
                //         <p>{joinedEvent.start_time + ' - ' + joinedEvent.end_time}</p>
                //       </div>
                //       <div className='cardSec2'>
                //         <button className='button is-danger' onClick={() => leaveEventButton(joinedEvent.id)}>Leave Event</button>
                //       </div>
                //       <div>
                //         <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1>
                //         <p>{joinedEvent.description}</p>
                //       </div>
                //     </div>
                // </>
              )
            }) : 'NAY'
          }
        </div>
        {/* <div className={currentTab !== 1 ? "is-hidden" : ""}>
          <p>test2</p>
        </div> */}
        <div className={currentTab !== 2 ? "is-hidden" : ""} style={{display:'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
          {
            created ? created[0].map(createdEvent => {
              console.log('result1' + createdEvent)
              return (
                // <div className='box eventBox' id={'eventId: ' + createdEvent.id}>
                //       <div>
                //         <h1 className='title'>{createdEvent.title}</h1>
                //         <p>{createdEvent.borough}</p>
                //         <p>{createdEvent.location}</p>
                //         <p>{createdEvent.start_date === createdEvent.end_date ? createdEvent.start_date.substring(0, 10) : createdEvent.start_date.substring(0, 10) + ' - ' + createdEvent.end_date.substring(0, 10)}</p>
                //         <p>{createdEvent.start_time + ' - ' + createdEvent.end_time}</p>
                //       </div>
                //       <div className='cardSec2'>
                //         <button className='button is-primary' onClick={() => deleteEventButton(createdEvent.id)}>Delete Event</button>
                //       </div>
                //       <div>
                //         <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1>
                //         <p>{createdEvent.description}</p>
                //       </div>
                //     </div>
                <>
                    <div className='box eventBox' id={`eventId: ${createdEvent.id}`} style={{ borderRadius: '0px', display: 'flex', flexDirection: 'column' }}>
                      <div className='eventCard'>
                      <figure className="image" style={{ width: '100%' }}>
                          <img src={createdEvent.image}/>
                      </figure>
                        <h1 className='title' style={{ paddingTop: '10px', fontSize: '20px'}}>{createdEvent.title}</h1>
                        <div>
                        <p>{`${createdEvent.start_time} - ${createdEvent.end_time}`}</p>
                        <p>{createdEvent.start_date === createdEvent.end_date ? createdEvent.start_date.substring(0, 10) : `${createdEvent.start_date.substring(0, 10)} - ${createdEvent.end_date.substring(0, 10)}`}</p>
                        </div>
                        <p style={{ color: '#9f9f9f' }}>{createdEvent.location}</p>
                        <p style={{ color: '#9f9f9f' }}>{createdEvent.borough}, NY</p>
                          <details style={{ }}>
                            <summary style={{ cursor: 'pointer'}}>Description</summary>
                            <p>{createdEvent.description}</p>
                          </details>
                      </div>
                      <div className='cardSec2'>
                        <button className='button' style={{ background: '#FFF', color: '#344d41', border: '2px solid #344d41', borderRadius: '0px', display: 'flex', alignSelf: 'flex-start' }} onClick={() => deleteEventButton(createdEvent.id)}>Delete Event</button>
                      </div>
                      <div>
                        {/* <h1 className='is-size-5 has-text-weight-bold mt-4'>Description</h1> */}
                        {/* <p>{event.description}</p> */}
                      </div>
                    </div>
                  </>
              )
            }) : 'NAY'
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard