import React, { useEffect, useState } from 'react';
import './ComingSoon.css';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = futureDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="soonConstruction-box">
      <div className="emoji">🛠️👷‍♀️</div>
      <h1>Oops! We're still building</h1>
      <p>Our fun website is under construction. Come back in:</p>
      <div className="countdown">
        {String(timeLeft.days).padStart(2, '0')}d{' '}
        {String(timeLeft.hours).padStart(2, '0')}h{' '}
        {String(timeLeft.minutes).padStart(2, '0')}m{' '}
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
};

export default ComingSoon;
