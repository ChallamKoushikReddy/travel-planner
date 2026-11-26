import { useState } from "react";
import "./App.css";
function DayCard({title,activity}){
  return(
    <article className="day-card">
      <h3>{title}</h3>
      <p>{activity}</p>
    </article>
  );
}
function App() {
  const [destination, setDestination] = useState("");
  const [interests, setInterests] = useState("");
  const [trip, setTrip] = useState(null);
  const [numberOfDays, setNumberOfDays]=useState("3");

  function handleSubmit(event) {
    event.preventDefault();

    if (!destination.trim()) {
      return;
    }

    const interestList = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest !== "");
    const itineraryDays=[
      {
        title:"Day 1",
        activity:`Explore the heart of${destination} and try a local restaurant`,
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

    setTrip({
      destination: destination,
      interests: interestList,
      days: itineraryDays.slice(0,Number(numberOfDays)),
    });
  }
  function handleClearTrip(){
    setTrip(null);
    setDestination("");
    setInterests("");
  }

  return (
    <main className="page">
      <section className="planner">
        <p className="eyebrow">Your next adventure</p>
        <h1>Plan your next trip</h1>

        <p className="intro">
          Tell us what you're looking for and we will build an itinerary.
        </p>

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
            What do you like to explore?
            <input
              type="text"
              placeholder="e.g. food, beaches, mountains"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
            />
          </label>
          <label>
            How many days?
            <select
              value={numberOfDays}
              onChange={(event)=> setNumberOfDays(event.target.value)}  
            >
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
            </select>
          </label>

          <button type="submit">Plan my trip</button>
        </form>

        {trip && (
          <section className="itinerary">
            <h2>Your trip to {trip.destination}</h2>

            <p>
              Interests:{" "}
              {trip.interests.length > 0
                ? trip.interests.join(", ")
                : "No interests selected"}
            </p>

            {trip.days.map((day) => (
              <DayCard key={day.title}
                       title={day.title}
                       activity={day.activity}></DayCard>
            ))}
            <button type="button" className="clear-button" onClick={handleClearTrip}>Plan another Trip</button>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;