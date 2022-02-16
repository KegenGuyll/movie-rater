import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';

import { useAuth } from '../../context/AuthUserContext';
import addMovie from '../../endpoints/watchlist/addMovie';
import createWatchList from '../../endpoints/watchlist/createWatchList';
import getAllWatchLists from '../../endpoints/watchlist/getAllWatchLists';
import getMovieExist from '../../endpoints/watchlist/getMovieExist';
import { MovieDocument } from '../../models/firestore';
import { MovieDetails } from '../../models/TMDB';
import { ExistMovie, WatchList } from '../../models/watchlist';
import Logger from '../../utils/logger';
import Button from '../button';
import Modal from '../modal';
import Typography from '../typography';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  movie: MovieDetails;
  personal: MovieDocument | null;
}

const WatchListModal: FunctionComponent<Props> = ({
  movie,
  ...props
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [watchListTitle, setWatchListTitle] = useState<string>('');
  const [watchListDes, setWatchListDes] = useState<string>('');
  const [watchListPub, setWatchListPub] = useState<boolean>(true);
  const [createWatchListBoolean, setCreateWatchList] = useState<boolean>(false);
  const [existMovie, setExistMovie] = useState<ExistMovie[] | null>(null);
  const [lists, setLists] = useState<WatchList[] | null>(null);
  const { authUser } = useAuth();
  const router = useRouter();

  const handleExistMovie = async () => {
    if (!authUser) return;

    const authToken = await authUser.getIdToken();

    getMovieExist(authToken, movie.id).then(({ res }) => {
      if (res) {
        setExistMovie(res.data);
      }
    });
  };

  const handleGetLists = () => {
    if (!authUser) return;

    authUser.getIdToken(true).then((authToken) => {
      getAllWatchLists(authToken).then(({ res }) => {
        if (res) {
          setLists(res.data);
        }
      });
    });
  };

  const handleViewWatchList = () => {
    setOpen(false);
    router.push('/watch-list');
  };

  useEffect(() => {
    handleExistMovie();
  }, [authUser]);

  useEffect(() => {
    handleGetLists();
  }, [authUser]);

  const handleMovieAdd = async (listId: string) => {
    if (!authUser) return;

    try {
      const authToken = await authUser.getIdToken(true);

      const { err } = await addMovie(movie.id, authToken, listId);

      if (err) {
        throw err;
      }

      handleExistMovie();

      setOpen(false);
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCreateWatchList = async (e: FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    try {
      const authToken = await authUser.getIdToken(true);

      await createWatchList(
        {
          description: watchListDes,
          public: watchListPub,
          title: watchListTitle,
          userId: authUser.uid,
        },
        authToken
      );

      handleGetLists();

      setCreateWatchList(false);
    } catch (error) {
      Logger.error(error);
    }
  };

  const renderModalAddWatchList = () => (
    <div className="text-dark-text">
      <div className="flex mb-4">
        <div className="mr-8">
          <Image
            alt={movie.title}
            className="rounded"
            height={120}
            objectFit="cover"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            width={80}
          />
        </div>
        <div>
          <Typography variant="h2">Add to list</Typography>
          <Typography variant="subtitle">{movie.title}</Typography>
        </div>
      </div>
      <div className="divide-y">
        <div className="pb-2 space-y-2">
          <Button
            className="w-full flex items-center "
            onClick={() => setCreateWatchList(true)}
          >
            <span className="material-icons-outlined mr-4">add</span>
            Create WatchList
          </Button>
          <Button
            className="w-full flex items-center"
            onClick={handleViewWatchList}
          >
            <span className="material-icons-outlined mr-4">view_list</span>
            View WatchLists
          </Button>
        </div>
        <div className="flex flex-col space-y-2 pt-2">
          {lists?.map((value) => (
            <Button
              key={value._id}
              className="w-full flex items-center"
              onClick={() => handleMovieAdd(value._id)}
            >
              <span className="material-icons-outlined mr-4">
                {existMovie
                  ? existMovie.map((movieValue) =>
                      movieValue.listId === value._id ? 'checklist_rtl' : 'list'
                    )
                  : 'list'}
              </span>
              {value.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModalCreateWatchList = () => (
    <div className="text-dark-text">
      <div className="mb-3">
        <Typography variant="h3">Create Watch List</Typography>
        <Typography variant="subtitle">
          {`creating this list will not add ${movie.title} to your new list`}
        </Typography>
      </div>
      <form>
        <div className="flex flex-col space-y-3 mb-3">
          <input
            className="p-2 bg-dark-components rounded"
            placeholder="Title"
            value={watchListTitle}
            onChange={(e) => setWatchListTitle(e.currentTarget.value)}
          />
          <textarea
            className="p-2 bg-dark-components rounded"
            placeholder="Description"
            value={watchListDes}
            onChange={(e) => setWatchListDes(e.currentTarget.value)}
          />
          <Button onClick={() => setWatchListPub(!watchListPub)}>
            <span className="material-icons-outlined mr-2">
              {watchListPub ? 'check_box' : 'check_box_outline_blank'}
            </span>
            Make this WatchList Public
          </Button>
        </div>
        <Button type="submit" onClick={(e) => handleCreateWatchList(e)}>
          Create
        </Button>
      </form>
    </div>
  );

  return (
    <>
      <Button
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onClick={() => setOpen(true)}
      >
        <Typography className="flex items-center" variant="subtitle">
          <span className="material-icons-outlined mr-2">
            {existMovie?.length ? 'check' : 'add'}
          </span>
          {existMovie?.length ? 'In Watchlist' : 'Add to Watchlist'}
        </Typography>
      </Button>
      <Modal open={open} setOpen={setOpen}>
        {!createWatchListBoolean && renderModalAddWatchList()}
        {createWatchListBoolean && renderModalCreateWatchList()}
      </Modal>
    </>
  );
};

export default WatchListModal;
