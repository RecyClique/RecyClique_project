import { listAllCreated, listAllJoined } from "../adapters/user-adapter"
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
        listAllJoined(currentUser.id)
      ];

      const [result1, result2] = await Promise.all(promises);
      setJoined(result2);
      setCreated(result1);
    };

    fetchData();
    // console.log(created? created[0]: null);
    // console.log(joined? joined[0]: null);
  }, [currentUser]);

  useEffect(() => {
    console.log(created ? created[0] : null);
    console.log(joined ? joined[0] : null);
  }, [created, joined]);

  const [currentTab, setCurrentTab] = useState(0);
  const changeTab = (index) => {
    setCurrentTab(index)
  }


  return (
    <>
      <div>
        <h1>Dashboard Page</h1>
      </div>



      <div className="tabs is-centered">
        <ul>
          <li className={currentTab === 0 ? "is-active" : ""} onClick={() => changeTab(0)}><a>Current Events</a></li>
          <li className={currentTab === 1 ? "is-active" : ""} onClick={() => changeTab(1)}><a>Past Events</a></li>
          <li className={currentTab === 2 ? "is-active" : ""} onClick={() => changeTab(2)}><a>Events Created</a></li>
        </ul>
      </div>
      <div className="tab-content">
        <div className={currentTab !== 0 ? "is-hidden" : ""}>

        </div>
        <div className={currentTab !== 1 ? "is-hidden" : ""}>
          <p>test2</p>
        </div>
        <div className={currentTab !== 2 ? "is-hidden" : ""}>
          {
            created ? created[0].map(createdEvent => {
              console.log('test' + createdEvent)
              return (
                <>
                  <p>{createdEvent.title}</p>
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