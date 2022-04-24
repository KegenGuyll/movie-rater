import Image from 'next/image';
import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getUserByUid from '../../endpoints/user/getUserByUid';
import { Position } from '../../endpoints/user/getUserLeaderboard';
import { User } from '../../models/user';
import Logger from '../../utils/logger';
import Typography from '../typography';

interface Props {
  user: Position;
}

const LeaderboardCard: FunctionComponent<Props> = ({ user }) => {
  const [userExtra, setUserExtra] = useState<User>();

  const fetchUserData = async () => {
    try {
      const { res, err } = await getUserByUid(user.uuid);

      if (res) {
        setUserExtra(res.data);
      }

      if (err) {
        throw err;
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!userExtra) return null;

  return (
    <div>
      <div
        key={user._id}
        className=" bg-dark-components rounded p-4 text-dark-text h-60 md:h-auto"
      >
        <Link passHref href={`/user/${user.uuid}`}>
          <a>
            <div className="flex items-center flex-wrap space-x-0 md:space-x-3 my-3 space-y-3 lg:space-y-0">
              <Image
                className="rounded-full"
                height={64}
                src={
                  userExtra.photoUrl
                  || `https://avatars.dicebear.com/api/initials/${
                    userExtra.displayName || user.email
                  }.svg`
                }
                width={64}
              />
              <Typography variant="h3">
                {userExtra.displayName || user.email.split('@')[0]}
              </Typography>
              <div className=" py-1 px-2 rounded bg-cta text-dark-background">
                <Typography variant="subtitle">
                  {`${user.reviews} ${
                    user.reviews > 1 ? 'Reviews' : 'Review'
                  }`}
                </Typography>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default LeaderboardCard;
