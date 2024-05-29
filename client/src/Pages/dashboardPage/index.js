import { useEffect } from "react";

function Dashboard() {

  useEffect(()=>{
    const data = localStorage.getItem('loggedUser')
    console.log(data);
  })

    return (
      <div>
        Dashboard
      </div>
    );
  }
  
  export default Dashboard;
  