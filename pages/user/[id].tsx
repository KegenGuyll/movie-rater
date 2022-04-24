import clsx from 'clsx';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import Button from '../../components/button';
import CopyLink from '../../components/copyLink';
import MetaTags from '../../components/metaTags';
import ReviewedMoviesTable from '../../components/my-movies/ReviewedMoviesTable';
import Navigation from '../../components/navigation';
import UserMedia from '../../components/sections/userMedia';
import Typography from '../../components/typography';
import { useAuth } from '../../context/AuthUserContext';
import followUser from '../../endpoints/user/followUser';
import getFullUser, { GetUserResponse } from '../../endpoints/user/getUser';
import getUserByUid from '../../endpoints/user/getUserByUid';
import getUserTopMovies, {
  GetUserTopMovies,
} from '../../endpoints/user/getUserTopMovies';
import { User } from '../../models/user';
import imageUrl from '../../utils/imageUrl';
import Logger from '../../utils/logger';

interface Props {
  fullUser: GetUserResponse | null;
  bestMovies: GetUserTopMovies[] | null;
  worstMovies: GetUserTopMovies[] | null;
}

const UserProfile: NextPage<Props> = ({
  fullUser,
  bestMovies,
  worstMovies,
}: Props) => {
  const router = useRouter();
  const { authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<User>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const getUser = async () => {
    if (!authUser) return;

    const { res } = await getUserByUid(authUser.uid);

    if (res) {
      setCurrentUser(res.data);
    }
  };

  const renderFollowStatus = () => {
    if (!currentUser) return;

    if (
      currentUser.following
      && fullUser
      && currentUser.following.includes(fullUser.uuid)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  const handleFollowUser = async () => {
    if (!authUser || !currentUser) return;
    if (!router.query.id || typeof router.query.id !== 'string') return;

    const token = await authUser.getIdToken();

    await followUser(router.query.id, token);

    await getUser();
  };

  useEffect(() => {
    getUser();
  }, [authUser]);

  useEffect(() => {
    renderFollowStatus();
  }, [currentUser, fullUser]);

  const canDelete = useMemo(() => {
    if (!authUser) return false;

    if (authUser.uid === router.query.id) {
      return true;
    }

    return false;
  }, [authUser]);

  if (!fullUser) {
    return (
      <div className="w-full h-screen text-white flex items-center justify-center">
        <Typography variant="h1"> 404 did not find user </Typography>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <MetaTags
        description={`${fullUser.displayName} currently has ${fullUser.reviews.length} Reviews and ${fullUser.watchLists.length} WatchLists`}
        image={fullUser.profilePath || fullUser.photoUrl}
        largeImage={`${imageUrl(300, false)}${fullUser.backdropPath}`}
        title={fullUser.displayName || fullUser.email.split('@')[0]}
        url={router.asPath}
      />
      <section className="relative flex px-8 py-32 lg:p-32 items-center bg-dark-components text-dark-text mb-12">
        {fullUser.backdropPath && (
          <Image
            layout="fill"
            objectFit="cover"
            src={`${imageUrl(500, false)}${fullUser.backdropPath}`}
          />
        )}

        <div
          className={clsx(
            ' w-full bg-dark-background bg-opacity-80 absolute top-0 bottom-0 left-0 right-0',
          )}
        />
        <div className="relative h-16 w-16 lg:h-32 lg:w-32 rounded-full">
          <Image
            className="rounded-full"
            layout="fill"
            src={
              fullUser.profilePath
              || fullUser.photoUrl
              || `https://avatars.dicebear.com/api/initials/${
                fullUser.displayName || fullUser.email
              }.svg`
            }
          />
        </div>
        <div className="relative ml-4 lg:ml-8">
          <div className="flex space-x-3">
            <Typography variant="h1">{fullUser.displayName}</Typography>
            <CopyLink link={`/user/${router.query.id}`} />
          </div>

          <div className="flex divide-x items-center">
            <Typography className="pr-2" variant="subtitle">
              {`${fullUser.reviews.length} Reviews`}
            </Typography>
            <Typography className="pl-2" variant="subtitle">
              {`${fullUser.watchLists.length} WatchLists`}
            </Typography>
          </div>
          {authUser && authUser.uid !== router.query.id && (
            <Button
              className=" text-dark-background w-full text-center mt-3"
              variant="primary"
              onClick={handleFollowUser}
            >
              <div className="text-center w-full flex items-center justify-center space-x-3 ">
                <span className="material-icons-outlined">
                  {isFollowing ? 'check' : 'add'}
                </span>
                <Typography variant="h4">
                  {isFollowing ? 'Following' : 'Follow'}
                </Typography>
              </div>
            </Button>
          )}
        </div>
      </section>
      <section className="mb-20">
        <UserMedia
          auth={canDelete}
          media={bestMovies}
          title="Highest Rated Media"
          watchLists={null}
        />
        {fullUser.watchLists.length && (
          <UserMedia
            auth={canDelete}
            media={null}
            title="WatchList"
            watchLists={fullUser.watchLists}
          />
        )}
        <UserMedia
          auth={canDelete}
          media={worstMovies}
          title="Lowest Rated Media"
          watchLists={null}
        />
      </section>
      <section>
        <ReviewedMoviesTable
          enableDelete={canDelete}
          movies={fullUser.reviews}
        />
      </section>
    </div>
  );
};

UserProfile.getInitialProps = async (context) => {
  try {
    const { id } = context.query;

    if (!id || typeof id !== 'string') {
      throw new Error(`user broken ${id}`);
    }

    const uuid = id;

    const { res: fullUser } = await getFullUser(uuid);
    const { res: bestMovies } = await getUserTopMovies(uuid, '-1', 10);
    const { res: worstMovies } = await getUserTopMovies(uuid, '1', 10);

    return {
      bestMovies: bestMovies && bestMovies.data,
      fullUser: fullUser && fullUser.data,
      worstMovies: worstMovies && worstMovies.data,
    };
  } catch (error) {
    Logger.error(error);

    return {
      bestMovies: null,
      fullUser: null,
      worstMovies: null,
    };
  }
};

export default UserProfile;
