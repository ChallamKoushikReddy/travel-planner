import { useState,useEffect} from "react";
import "./App.css";
function DayCard({title,date,activity}){
  return(
    <article className="day-card">
      <h3>{title}</h3>
      <p>{date}</p>
      <p>{activity}</p>
    </article>
  );
}
function formatDate(dateString){
  return new 
  Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN",{
    day:"numeric",
    month:"short",
    year:"numeric",
  });
}
function formatDayDate(startDate,daysToAdd){
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate()+daysToAdd);
  return date.toLocaleDateString("en-IN",{
    weekday:"long",
    day:"numeric",
    month:"short",
  });

}
function getTripLength(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor((end - start) / millisecondsPerDay) + 1;
}

function App() {
  const [destination, setDestination] = useState("");
  const [interests, setInterests] = useState("");
  const [trip, setTrip] = useState(()=>{
    const savedTrip = localStorage.getItem("current-trip");
    return savedTrip?JSON.parse(savedTrip):null;
  });
  const [savedTrips,setSavedTrips]=useState(()=>{
    const storedTrips = localStorage.getItem("saved-trips");
    return storedTrips?JSON.parse(storedTrips):[];
  });
  const [showSavedTrips,setShowSavedTrips]=useState(false);
  const [error,setError]=useState("");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");

  useEffect(()=>
  {
    if(trip){
      localStorage.setItem("current-trip",JSON.stringify(trip));
      document.title= `Trip to ${trip.destination}`;

    } else{
      localStorage.removeItem("current-trip");
      document.title="Travel Planner";
    }

  },[trip]
  );
  useEffect(()=>{
    localStorage.setItem("saved-trips",JSON.stringify(savedTrips));
  },[savedTrips]);


  function handleSubmit(event) {
    event.preventDefault();

    if (!destination.trim()) {
      setError("Please enter a destination before planning your trip");
      return;
    }
    if(!startDate || !endDate){
      setError("Please select a start and end date");
      return;
    }
    if(endDate<startDate){
      setError("Your end date must be after your start day");
      return;
    }
    const tripLength = getTripLength(startDate,endDate);
    if(tripLength >3){
      setError("Present working model is for 3 days");
      return;
    }

    setError("");

    const interestList = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest !== "");
    const itineraryDays=[
      {
        title:"Day 1",
        activity:`Explore the heart of ${destination} and try a local restaurant`,
      },
      {
        title:"Day 2",
        activity:`Spend time enjoying ${interestList[0]||"popular local experiences"}.`,
      },
      {
        title:"Day 3",
        activity:`Visiting a landmark and enjoy relaxed final evening.`,
      },
    ];
    const selectedDays = itineraryDays.slice(0,tripLength).map((day,index) => ({
      ...day,
      date:formatDayDate(startDate,index),
    }));
    setShowSavedTrips(false);
    setTrip({
      destination: destination,
      interests: interestList,
      startDate:startDate,
      endDate: endDate,
      days: selectedDays,
    });
  }
  function handleClearTrip(){
    setTrip(null);
    setDestination("");
    setInterests("");
    setStartDate("");
    setEndDate("");
  }
  function handleSaveTrip(){
    if(!trip){
      return;
    }
  
  const tripToSave = {
    ...trip,
    id:crypto.randomUUID(),
  };
  setSavedTrips((currentTrips)=>[
    ...currentTrips,
    tripToSave,
  ]);
  setShowSavedTrips(false);
}
function handleShowSavedTrips(){
  handleClearTrip();
  setShowSavedTrips(true);
}

  return (
    <main className="page">
      <section className="planner">
        <p className="eyebrow">Your Next Memory</p>
        <h1>Plan your next trip</h1>

        <p className="intro">
          Tell us what you're looking for and we will build an itinerary.
        </p>
        {error && <p className="error-class">{error}</p>}

        <form className="trip-form" onSubmit={handleSubmit}>
          <label>
            Where do you want to go?
            <input
              type="text"
              placeholder="e.g. Tokyo"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </label>
          <label>
            Start date
            <input
              type="date"
              value={startDate}
              onChange = {(event)=> setStartDate(event.target.value)}
            />
          </label>

          <label>
            End date
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange= {(event)=> setEndDate(event.target.value)}
            />
          </label>

          <label>
            What do you like to explore?
            <input
              type="text"
              placeholder="e.g. food, beaches, mountains"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
            />
          </label>
          <button type="submit">Plan my trip</button>
        </form>
        {savedTrips.length>0 && !showSavedTrips &&(
          <button
            type="button"
            className="show-saved-button"
            onClick={handleShowSavedTrips}>
              Display wishlist
              </button>
        )}

        {trip && (
          <section className="itinerary">
            <h2>Your trip to {trip.destination}</h2>
            <p>
              {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
            </p>

            <p>
              Interests:{" "}
              {trip.interests.length > 0
                ? trip.interests.join(", ")
                : "No interests selected"}
            </p>

            {trip.days.map((day) => (
              <DayCard key={day.title}
                       title={day.title}
                       date={day.date}
                       activity={day.activity}></DayCard>
            ))}
            <button type="button" className="clear-button" onClick={handleClearTrip}>Plan another Trip</button>
            <button type="button" className="save-button" onClick={handleSaveTrip}> Add to WishList</button>
          </section>
        )}
        {showSavedTrips && savedTrips.length>0 && (
          <section className="saved-trips">
            <h2>Saved Trips</h2>
            {savedTrips.map((savedTrip)=>(
              <article className="saved-trip-card" key={savedTrip.id}>
                <h3>{savedTrip.destination}</h3>
                <p>
                  {formatDate(savedTrip.startDate)} to{" "}
                  {formatDate(savedTrip.endDate)}
                </p>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;