import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_REVIEWS, LIVE_REVIEW_POOL } from "../data/mockData.js";
import { randomRoom } from "../utils/helpers.js";

const ReviewsContext = createContext(null);

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Stream a new review every 9 seconds
  useEffect(() => {
    const t = setInterval(() => {
      const base = LIVE_REVIEW_POOL[Math.floor(Math.random() * LIVE_REVIEW_POOL.length)];
      setReviews(prev => [
        {
          ...base,
          id:         Date.now(),
          department: base.department,
          room:       randomRoom(),
          time:       "just now",
        },
        ...prev.slice(0, 49),
      ]);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside <ReviewsProvider>");
  return ctx;
}
