import Image from 'next/image';
import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getUserByUid from '../endpoints/user/getUserByUid';
import { User } from '../models/user';
import Logger from '../utils/logger';

interface Props {
  userId: string;
}

const UserImage: FunctionComponent<Props> = ({ userId }) => {
  const [user, setUser] = useState<User>();

  const fetchUserData = async () => {
    try {
      const { res, err } = await getUserByUid(userId);

      if (res) {
        setUser(res.data);
      }

      if (err) {
        throw err;
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!user) return null;

  return (
    <Link passHref href={`/user/${userId}`}>
      <a>
        <div
          className="flex items-center flex-wrap space-x-0 md:space-x-3 my-3 space-y-3 lg:space-y-0"
          title={user.displayName || user.email.split('@')[0]}
        >
          <Image
            className="rounded-full"
            height={64}
            src={
              user.photoUrl
              || `https://avatars.dicebear.com/api/initials/${user.displayName || user.email
              }.svg`
            }
            width={64}
          />
        </div>
      </a>
    </Link>
  );
};

export default UserImage;
