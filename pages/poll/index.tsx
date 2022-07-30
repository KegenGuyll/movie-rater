import clsx from 'clsx';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Button from '../../components/button';
import MetaTags from '../../components/metaTags';
import Navigation from '../../components/navigation';
import Search from '../../components/search';
import Typography from '../../components/typography';
import { useAuth } from '../../context/AuthUserContext';
import createPoll, {
  Categories,
  PollPayload,
} from '../../endpoints/poll/createPoll';
import Logger from '../../utils/logger';

export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://tmrev.io',
      permanent: false,
    },
  };
}

const Poll: NextPage = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { authUser } = useAuth();
  const router = useRouter();

  const onSubmit = async () => {
    if (!authUser) return;

    const payload: PollPayload = {
      categories,
      description,
      title,
    };

    const token = await authUser.getIdToken();

    const { res, err } = await createPoll(payload, token);

    if (err) {
      Logger.error(err);
    }

    if (res) {
      router.push(`/poll/${res.data._id}`);
    }
  };

  const removeCategory = (index:number) => {
    const newArray = [...categories];

    newArray.splice(index, 1);

    setCategories(newArray);
  };

  return (
    <>
      <MetaTags description="" title="Create a Movie Poll" url="/poll" />
      <Navigation />
      <div className="flex justify-center items-center px-4 md:px-8 lg:px-40">
        <div className="bg-dark-components space-y-4 p-4 xl:p-8 max-w-2xl w-full text-dark-text rounded">
          <Typography variant="h1">Create Poll</Typography>
          <div className="space-y-1">
            <Typography variant="subtitle">Title</Typography>
            <input
              aria-label="title"
              className={clsx(
                'py-[7px] px-3 w-full bg-dark-background rounded',
                'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
              )}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="space-y-1">
            <Typography variant="subtitle">Description</Typography>
            <textarea
              aria-label="description"
              className={clsx(
                'py-[7px] px-3 w-full bg-dark-background rounded',
                'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
              )}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
          <div className="space-y-1">
            <Typography variant="subtitle">Add Media to Poll</Typography>
            <Search poll setPollState={setCategories} />
          </div>
          <div className=" space-y-3">
            {categories.map((category, index) => (
              <div key={category.tmdbId}>
                <div className=" bg-dark-light flex items-center p-4 rounded">
                  <Typography>{category.title}</Typography>
                  <div className="flex-grow" />
                  <button className="" type="button" onClick={() => removeCategory(index)}>
                    <span className="material-icons-outlined">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full text-dark-background font-semibold" variant="primary" onClick={onSubmit}>Create Poll</Button>
        </div>
      </div>
    </>
  );
};

export default Poll;
