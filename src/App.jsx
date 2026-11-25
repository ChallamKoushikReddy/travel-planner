import { useState } from "react";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [interests, setInterests] = useState("");
  const [trip, setTrip] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (!destination.trim()) {
      return;
    }

    const interestList = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest !== "");

    setTrip({
      destination: destination,
      interests: interestList,
      days: [
        {
          title: "Day 1",
          activity: `Explore the heart of ${destination} and try a local restaurant.`,
        },
        {
          title: "Day 2",
          activity: `Spend time enjoying ${
            interestList[0] || "popular local experiences"
          }.`,
        },
        {
          title: "Day 3",
          activity:
            "Visit a landmark,enjoy a relaxed final evening.",
        },
      ],
    });
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
              <article className="day-card" key={day.title}>
                <h3>{day.title}</h3>
                <p>{day.activity}</p>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;