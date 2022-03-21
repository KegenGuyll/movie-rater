import React, { FunctionComponent, useEffect, useState } from 'react';

import getUserLeaderboard, {
  Leaderboard,
} from '../../endpoints/user/getUserLeaderboard';
import Logger from '../../utils/logger';
import Typography from '../typography';
import LeaderboardCard from './leaderboardCard';

const UserLeaderboard: FunctionComponent = () => {
  const [leaderboard, setLeaderboard] = useState<Leaderboard>();

  const fetchUserLeaderboard = async () => {
    const { res, err } = await getUserLeaderboard();

    if (res) {
      setLeaderboard(res.data);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchUserLeaderboard();
  }, []);

  if (!leaderboard) return null;

  return (
    <div className="p-8 text-dark-text">
      <Typography className=" text-cta flex-grow mb-8" variant="h2">
        Leaderboard
      </Typography>
      <div className="grid grid-cols-2 gap-3 ">
        <div className="grid grid-cols-1 gap-3">
          <Typography className="mb-3" variant="h3">
            Weekly
          </Typography>
          {leaderboard.weekly.map((userWeekly) => (
            <LeaderboardCard key={userWeekly._id} user={userWeekly} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Typography className="mb-3" variant="h3">
            All Time
          </Typography>
          {leaderboard.allTime.map((userWeekly) => (
            <LeaderboardCard key={userWeekly._id} user={userWeekly} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLeaderboard;
