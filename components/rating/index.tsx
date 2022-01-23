import { FunctionComponent, useMemo, useState } from 'react';
import Typography from '../typography';
import RateList from './rateList';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthUserContext';
import { RottenMovie } from '../../models/rottenTomatoes';
import { IMDBMovie } from '../../models/imdb/popular';
import createReviewedMovie from '../../endpoints/review/createReviewMovie';
import { AdvancedScore } from '../../models/firestore';

interface Props {
  advanceScore?: boolean;
  setAdvanceScore: (value: boolean) => void;
  movie: RottenMovie | null;
  imdb: IMDBMovie | null;
  closeModal: (value: boolean) => void;
  defaultScore?: AdvancedScore | null;
  defaultSimpleScore?: number | null;
}

const Rating: FunctionComponent<Props> = ({
  advanceScore,
  setAdvanceScore,
  movie,
  imdb,
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
        uuid: movie?.uuid,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        title: movie?.title,
        rotten: {
          ...movie,
        },
        imdb: {
          ...imdb,
        },
        notes,
        simpleScore: score,
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
        advancedScore: {
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
        },
      };

      const token = await authUser.getIdToken(true);

      await createReviewedMovie(docData, token);

      closeModal(false);
    }
  };

  const submitSimpleScore = async () => {
    if (!authUser) return;

    const docData = {
      uuid: movie?.uuid,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      title: movie?.title,
      notes,
      rotten: {
        ...movie,
      },
      imdb: {
        ...imdb,
      },
      simpleScore: score,
      averagedAdvancedScore: null,
      advancedScore: null,
    };

    const token = await authUser.getIdToken(true);

    await createReviewedMovie(docData, token);

    closeModal(false);
  };

  if (advanceScore) {
    return (
      <div className='space-y-4'>
        <button
          onClick={() => setAdvanceScore(false)}
          className='bg-dark-components py-1 px-3 rounded text-dark-text w-full'>
          <Typography>Simple Rating</Typography>
        </button>
        <div className='flex flex-col space-y-4'>
          <RateList
            defaultValue={defaultScore?.plot}
            scale={10}
            setValue={setPlot}
            label='Plot'
          />
          <RateList
            defaultValue={defaultScore?.theme}
            scale={10}
            setValue={setTheme}
            label='Theme'
          />
          <RateList
            defaultValue={defaultScore?.climax}
            scale={10}
            setValue={setClimax}
            label='Climax'
          />
          <RateList
            defaultValue={defaultScore?.ending}
            scale={10}
            setValue={setEnding}
            label='Ending'
          />
          <RateList
            defaultValue={defaultScore?.acting}
            scale={10}
            setValue={setActing}
            label='Acting'
          />
          <RateList
            defaultValue={defaultScore?.characters}
            scale={10}
            setValue={setCharacters}
            label='Characters'
          />
          <RateList
            defaultValue={defaultScore?.music}
            scale={10}
            setValue={setMusic}
            label='Music'
          />
          <RateList
            defaultValue={defaultScore?.cinematography}
            scale={10}
            setValue={setCinematography}
            label='Cinematography'
          />
          <RateList
            defaultValue={defaultScore?.visuals}
            scale={10}
            setValue={setVisuals}
            label='Visuals'
          />
          <RateList
            defaultValue={defaultScore?.personalScore}
            scale={10}
            setValue={setPersonalScore}
            label='Personal Score'
          />
          {openNotes && (
            <textarea
              className='bg-dark-components rounded focus:border focus:border-cta transition-colors duration-300 focus:outline-none text-dark-text p-2'
              onChange={(e) => setNotes(e.currentTarget.value)}
              rows={4}
            />
          )}
          <button
            onClick={() => setOpenNotes(!openNotes)}
            className='bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed'>
            <Typography>{openNotes ? 'Close Notes' : `Add Notes`}</Typography>
          </button>
          <button
            onClick={submitAdvanceScore}
            className='bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={buttonDisabled}>
            <Typography>Rate Movie</Typography>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <button
        onClick={() => setAdvanceScore(true)}
        className='bg-dark-components py-1 px-3 rounded text-dark-text w-full'>
        <Typography>Advanced Rating</Typography>
      </button>
      <div className='flex flex-col space-y-4'>
        <RateList
          defaultValue={defaultSimpleScore}
          scale={10}
          setValue={setScore}
          label='Score'
        />
        {openNotes && (
          <textarea
            className='bg-dark-components rounded focus:border focus:border-cta transition-colors duration-300 focus:outline-none text-dark-text p-2'
            onChange={(e) => setNotes(e.currentTarget.value)}
            rows={4}
          />
        )}
        <button
          onClick={() => setOpenNotes(!openNotes)}
          className='bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed'>
          <Typography>{openNotes ? 'Close Notes' : `Add Notes`}</Typography>
        </button>
        <button
          onClick={submitSimpleScore}
          className='bg-dark-components py-1 px-3 rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={!score}>
          <Typography>Rate Movie</Typography>
        </button>
      </div>
    </div>
  );
};

Rating.defaultProps = {
  advanceScore: false,
};

export default Rating;
