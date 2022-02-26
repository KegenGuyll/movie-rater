import Image from 'next/image';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getUserByUid from '../../endpoints/user/getUserByUid';
import { MovieDocument } from '../../models/firestore';
import { User } from '../../models/user';
import Logger from '../../utils/logger';
import Typography from '../typography';

interface Props {
  media: MovieDocument;
}

const SocialRatingCard: FunctionComponent<Props> = ({ media }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const { res, err } = await getUserByUid(media.userId);

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
    if (media) {
      fetchUserData();
    }
  }, [media]);

  if (!user) return null;

  return (
    <div className=" bg-dark-components rounded p-4">
      <div className="flex items-center space-x-3 my-3">
        <Image
          className="rounded-full"
          height={64}
          src={
            user.photoUrl ||
            `https://avatars.dicebear.com/api/initials/${
              user.displayName || user.email
            }.svg`
          }
          width={64}
        />
        <Typography variant="h3">
          {user.displayName || user.email.split('@')[0]}
        </Typography>
        <div className=" py-1 px-2 rounded bg-cta text-dark-background">
          <Typography variant="subtitle">
            {media.averagedAdvancedScore || media.simpleScore}
          </Typography>
        </div>
      </div>
      <Typography>{media.notes}</Typography>
    </div>
  );
};

export default SocialRatingCard;
