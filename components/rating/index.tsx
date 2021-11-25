import { FunctionComponent, useMemo, useState } from 'react';
import Typography from '../typography';
import RateList from './rateList';
import db from '../../config/firebaseInit';
import { doc, setDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../context/AuthUserContext';
import { RottenMovie } from '../../models/rottenTomatoes';
import { IMDBMovie } from '../../models/imdb/popular';
import jwt from 'jsonwebtoken';

interface Props {
  advanceScore?: boolean;
  setAdvanceScore: (value: boolean) => void;
  movie: RottenMovie | null;
  imdb: IMDBMovie | null;
  closeModal: (value: boolean) => void;
}

const Rating: FunctionComponent<Props> = ({
  advanceScore,
  setAdvanceScore,
  movie,
  imdb,
  closeModal,
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
        unqiueid: jwt.sign(
          { rotten: movie?.uuid, imdb: imdb?.uuid },
          process.env['NEXT_PUBLIC_JWT_PRIVATE_KEY'] as string
        ),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        title: movie?.title,
        rotten: {
          ...movie,
        },
        imdb: {
          ...imdb,
        },
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

      await setDoc(doc(db, authUser.uid, movie!.uuid), docData, {
        mergeFields: [
          'advancedScore',
          'averagedAdvancedScore',
          'updatedAt',
          'rotten',
          'imdb',
        ],
      });

      closeModal(false);
    }
  };

  const submitSimpleScore = async () => {
    if (!authUser) return;

    const docData = {
      unqiueid: jwt.sign(
        { rotten: movie?.uuid, imdb: imdb?.uuid },
        process.env['NEXT_PUBLIC_JWT_PRIVATE_KEY'] as string
      ),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      title: movie?.title,
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

    await setDoc(doc(db, authUser.uid, movie!.uuid), docData, {
      mergeFields: ['simpleScore', 'updatedAt'],
    });

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
          <RateList scale={10} setValue={setPlot} label='Plot' />
          <RateList scale={10} setValue={setTheme} label='Theme' />
          <RateList scale={10} setValue={setClimax} label='Climax' />
          <RateList scale={10} setValue={setEnding} label='Ending' />
          <RateList scale={10} setValue={setActing} label='Acting' />
          <RateList scale={10} setValue={setCharacters} label='Characters' />
          <RateList scale={10} setValue={setMusic} label='Music' />
          <RateList
            scale={10}
            setValue={setCinematography}
            label='Cinematography'
          />
          <RateList scale={10} setValue={setVisuals} label='Visuals' />
          <RateList
            scale={10}
            setValue={setPersonalScore}
            label='Personal Score'
          />
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
        <RateList scale={10} setValue={setScore} label='Score' />
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
