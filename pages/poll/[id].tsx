import clsx from 'clsx';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import MetaTags from '../../components/metaTags';
import Navigation from '../../components/navigation';
import Typography from '../../components/typography';
import { useAuth } from '../../context/AuthUserContext';
import { PollResponse } from '../../endpoints/poll/createPoll';
import getPoll from '../../endpoints/poll/getPoll';
import votePoll from '../../endpoints/poll/votePoll';
import Logger from '../../utils/logger';

interface Props {
    poll: PollResponse | null
    totalVotes: number | null
    winnerIndex: number | null
}

const PollVoting: NextPage<Props> = ({ poll, totalVotes, winnerIndex }:Props) => {
  const { authUser, signInAnonymously } = useAuth();
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const fetchVote = async (id: string, token: string, category:string) => {
    const { res, err } = await votePoll(id, token, category);

    if (res) {
      refreshData();
    }

    if (err) {
      throw new Error(err.message);
    }
  };

  const handleVote = async (category: string) => {
    try {
      if (!poll) return;
      if (!authUser) {
        const { user } = await signInAnonymously();
        const token = await user.getIdToken();
        await fetchVote(poll._id, token, category);
      } else {
        const token = await authUser.getIdToken();
        await fetchVote(poll._id, token, category);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  if (!poll) {
    return (
      <div><Typography>No Poll</Typography></div>
    );
  }

  const pollResults = () => (
    <div className="bg-dark-components rounded p-4 text-dark-text w-96">
      <div>
        <Typography variant="h1">
          {poll.title}
          {' '}
          | Results
        </Typography>

      </div>
      <div className="space-y-3 mt-3">
        {poll.categories.map((category, index) => (
          <div
            key={category.tmdbId}
            className={clsx(
              'rounded p-4 w-full text-left',
              index === winnerIndex && 'bg-cta text-dark-background',
            )}
          >
            <Typography>{category.title}</Typography>
            {totalVotes && (
            <Typography>
              {(category.votes.length / totalVotes) * 100}
              %
            </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <MetaTags description={poll.description} title={poll.title} url={`/poll/${poll._id}`} />
      <Navigation />
      <div className="justify-center flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 items-center  w-screen px-4 md:px-8">
        {poll.creator === authUser?.uid && pollResults()}
        <div className="bg-dark-components rounded p-4 text-dark-text w-96">
          <div>
            <Typography variant="h1">{poll.title}</Typography>
            <Typography variant="subtitle">{poll.description}</Typography>
          </div>
          <div className="space-y-3 mt-3">
            {poll.categories.map((category) => (
              <button
                key={category.tmdbId}
                className={clsx(
                  'rounded p-4 w-full text-left',
                  category.votes.includes(authUser ? authUser.uid : '') ? ' bg-cta text-dark-background' : 'bg-dark-light',
                )}
                disabled={!poll.active}
                type="button"
                onClick={() => handleVote(category.title)}
              >
                <Typography>{category.title}</Typography>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

PollVoting.getInitialProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    let voteTotal = 0;
    let max = -Infinity;
    let index = -1;

    if (!id || typeof id !== 'string') throw new Error('misformed id');

    const { res, err } = await getPoll(id);

    if (err) {
      throw err.message;
    }

    if (!res) throw new Error('Cannot find poll');

    res.data.categories.forEach((category) => {
      voteTotal += category.votes.length;
    });

    res.data.categories.forEach((a, i) => {
      if (a.votes.length > max) {
        max = a.votes.length;
        index = i;
      }
    });

    return {
      poll: res.data,
      totalVotes: voteTotal,
      winnerIndex: index,
    };
  } catch (error) {
    Logger.error(error);
    return {
      poll: null,
      totalVotes: null,
      winnerIndex: null,
    };
  }
};

export default PollVoting;
