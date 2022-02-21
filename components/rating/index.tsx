import { Timestamp } from 'firebase/firestore';
import React, { FunctionComponent, useMemo, useState } from 'react';

import { useAuth } from '../../context/AuthUserContext';
import createReviewedMovie from '../../endpoints/review/createReviewMovie';
import { AdvancedScore } from '../../models/firestore';
import { MovieDetails } from '../../models/TMDB';
import { TVDetails } from '../../models/TMDB/tv';
import Typography from '../typography';
import RateList from './rateList';

interface Props {
  advanceScore?: boolean;
  // eslint-disable-next-line no-unused-vars
  setAdvanceScore: (value: boolean) => void;
  media: MovieDetails | TVDetails;
  // eslint-disable-next-line no-unused-vars
  closeModal: (value: boolean) => void;
  defaultScore?: AdvancedScore | null;
  defaultSimpleScore?: number | null;
}

const Rating: FunctionComponent<Props> = ({
  advanceScore,
  setAdvanceScore,
  media,
  closeModal,
  defaultScore,
  defaultSimpleScore,
}: Props) => {
  const [plot, setPlot] = useState<number | null>(null);
  const [theme, setTheme] = useState<number | null>(null);
  const [climax, setClimax] = useState<number | null>(null);
  const [ending, setEnding] = useState<number | null>(null);
  const [acting, setActing] = useState<number | null>(null);
  const [characters, setCharacters] = useState<number | null>(null);
  const [music, setMusic] = useState<number | null>(null);
  const [cinematography, setCinematography] = useState<number | null>(null);
  const [visuals, setVisuals] = useState<number | null>(null);
  const [personalScore, setPersonalScore] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const { authUser } = useAuth();
  const buttonDisabled = useMemo(
    () =>
      !plot ||
      !theme ||
      !climax ||
      !ending ||
      !acting ||
      !characters ||
      !music ||
      !cinematography ||
      !visuals ||
      !personalScore,
    [
      plot,
      theme,
      climax,
      ending,
      acting,
      characters,
      music,
      cinematography,
      visuals,
      personalScore,
    ]
  );

  const submitAdvanceScore = async () => {
    if (!authUser) return;
    if (
      plot &&
      theme &&
      climax &&
      ending &&
      acting &&
      characters &&
      music &&
      cinematography &&
      visuals &&
      personalScore
    ) {
      const docData = {
        advancedScore: {
          acting,
          characters,
          cinematography,
          climax,
          ending,
          music,
          personalScore,
          plot,
          theme,
          visuals,
        },
        averagedAdvancedScore:
          (plot +
            theme +
            climax +
            ending +
            acting +
            characters +
            music +
            cinematography +
            visuals +
            personalScore) /
          10,
        createdAt: Timestamp.fromDate(new Date()),
        notes,
        release_date:
          media.media_type === 'movie'
            ? media.release_date
            : media.first_air_date,
        simpleScore: score,
        title: media.media_type === 'movie' ? media.title : media.name,
        tmdbID: media.id,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      const token = await authUser.getIdToken(true);

      await createReviewedMovie(docData, token);

      closeModal(false);
    }
  };

  const submitSimpleScore = async () => {
    if (!authUser) return;

    const docData = {
      advancedScore: null,
      averagedAdvancedScore: null,
      createdAt: Timestamp.fromDate(new Date()),
      notes,
      release_date:
        media.media_type === 'movie'
          ? media.release_date
          : media.first_air_date,
      simpleScore: score,
      title: media.media_type === 'movie' ? media.title : media.name,
      tmdbID: media.id,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    const token = await authUser.getIdToken(true);

    await createReviewedMovie(docData, token);

    closeModal(false);
  };

  if (advanceScore) {
    return (
      <div className="space-y-4">
        <button
          className="bg-dark-components py-1 px-3 rounded text-dark-text w-full"
          type="button"
          onClick={() => setAdvanceScore(false)}
        >
          <Typography>Simple Rating</Typography>
        </button>
        <div className="flex flex-col space-y-4">
          <RateList
            defaultValue={defaultScore?.plot}
            label="Plot"
            scale={10}
            setValue={setPlot}
          />
          <RateList
            defaultValue={defaultScore?.theme}
            label="Theme"
            scale={10}
            setValue={setTheme}
          />
          <RateList
            defaultValue={defaultScore?.climax}
            label="Climax"
            scale={10}
            setValue={setClimax}
          />
          <RateList
            defaultValue={defaultScore?.ending}
            label="Ending"
            scale={10}
            setValue={setEnding}
          />
          <RateList
            defaultValue={defaultScore?.acting}
            label="Acting"
            scale={10}
            setValue={setActing}
          />
          <RateList
            defaultValue={defaultScore?.characters}
            label="Characters"
            scale={10}
            setValue={setCharacters}
          />
          <RateList
            defaultValue={defaultScore?.music}
            label="Music"
            scale={10}
            setValue={setMusic}
          />
          <RateList
            defaultValue={defaultScore?.cinematography}
            label="Cinematography"
            scale={10}
            setValue={setCinematography}
          />
          <RateList
            defaultValue={defaultScore?.visuals}
            label="Visuals"
            scale={10}
            setValue={setVisuals}
          />
          <RateList
            defaultValue={defaultScore?.personalScore}
            label="Personal Score"
            scale={10}
            setValue={setPersonalScore}
          />
          {openNotes && (
            <textarea
              className="bg-dark-components rounded focus:border focus:border-cta transition-colors duration-300 focus:outline-none text-dark-text p-2"
              rows={4}
              onChange={(e) => setNotes(e.currentTarget.value)}
            />
          )}
          <button
            className="bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={() => setOpenNotes(!openNotes)}
          >
            <Typography>{openNotes ? 'Close Notes' : `Add Notes`}</Typography>
          </button>
          <button
            className="bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={buttonDisabled}
            type="button"
            onClick={submitAdvanceScore}
          >
            <Typography>Rate Movie</Typography>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        className="bg-dark-components py-1 px-3 rounded text-dark-text w-full"
        type="button"
        onClick={() => setAdvanceScore(true)}
      >
        <Typography>Advanced Rating</Typography>
      </button>
      <div className="flex flex-col space-y-4">
        <RateList
          defaultValue={defaultSimpleScore}
          label="Score"
          scale={10}
          setValue={setScore}
        />
        {openNotes && (
          <textarea
            className="bg-dark-components rounded focus:border focus:border-cta transition-colors duration-300 focus:outline-none text-dark-text p-2"
            rows={4}
            onChange={(e) => setNotes(e.currentTarget.value)}
          />
        )}
        <button
          className="bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={() => setOpenNotes(!openNotes)}
        >
          <Typography>{openNotes ? 'Close Notes' : `Add Notes`}</Typography>
        </button>
        <button
          className="bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!score}
          type="button"
          onClick={submitSimpleScore}
        >
          <Typography>Rate Movie</Typography>
        </button>
      </div>
    </div>
  );
};

Rating.defaultProps = {
  advanceScore: false,
  defaultScore: null,
  defaultSimpleScore: null,
};

export default Rating;
