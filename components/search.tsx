import { useFocusWithin } from "@react-aria/interactions";
import clsx from "clsx";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  FunctionComponent,
  HtmlHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

import getMovieSearch from "../endpoints/TMDB/getMovieSearch";
import { Movie, Person, TV } from "../models/TMDB";
import Logger from "../utils/logger";
import Typography from "./typography";

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {}

const Search: FunctionComponent<Props> = ({ className, ...props }: Props) => {
  const [query, setQuery] = useState("");

  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tv, setTv] = useState<TV[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const [collapseMovies, setCollapseMovies] = useState<boolean>(false);
  const [collapseTv, setCollapseTv] = useState<boolean>(false);
  const [collapsePeople, setCollapsePeople] = useState<boolean>(false);

  const [isFocusWithin, setFocusWithin] = React.useState(false);
  const {focusWithinProps} = useFocusWithin({
    onFocusWithinChange: isFocusWithinEvent => setFocusWithin(isFocusWithinEvent)
  });


  // eslint-disable-next-line no-undef
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/movie/search?search=${query}`)
  }

  const handleFetch = async (q: string) => {
    const { res, err } = await getMovieSearch(q);

    if (res) {
      const filteredMovie = res.data.results.filter(
        (movie) => movie.media_type === "movie"
        // eslint-disable-next-line prettier/prettier
      ) as unknown as Movie[];
      setMovies(filteredMovie);

      const filteredTv = res.data.results.filter(
        (movie) => movie.media_type === "tv"
        // eslint-disable-next-line prettier/prettier
      ) as unknown as TV[];
      setTv(filteredTv);

      const filteredPeople = res.data.results.filter(
        (movie) => movie.media_type === "person"
        // eslint-disable-next-line prettier/prettier
      ) as unknown as Person[];
      setPeople(filteredPeople);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    if (!query) return;

    handleFetch(query);
  }, [query]);

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  return (
    <div
      className={clsx(className, "flex text-dark-text relative")}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...focusWithinProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <form className="w-full" onSubmit={handleSubmit}>
        <input
          className={clsx(
            "py-[7px] px-3 w-full bg-dark-background rounded",
            "focus:border focus:border-cta transition-colors duration-300 focus:outline-none"
          )}
          onChange={debouncedChangeHandler}
        />
      </form>
      <button
        className={clsx(
          "py-[7px] px-3 rounded-r bg-dark-light flex items-center justify-center",
          "focus:border focus:border-cta transition-colors duration-300 focus:outline-none"
        )}
        type="button"
      >
        <span className="material-icons-outlined px-4 ">search</span>
      </button>
      {query && isFocusWithin && (
        <div className="absolute top-12 w-full p-4 rounded shadow bg-dark-components"
          >
          <ul className=" max-h-96 overflow-auto">
            <div>
              <button
                className="hover:bg-dark-light flex w-full p-2 text-left rounded"
                type="button"
                onClick={() => setCollapseMovies(!collapseMovies)}
              >
                <Typography className="flex-grow" variant="h3">
                  Movies
                </Typography>
                <span className="material-icons-outlined">
                  {!collapseMovies ? "expand_less" : "expand_more"}
                </span>
              </button>
              {!collapseMovies &&
                movies.map((value) => (
                  <li key={value.id}>
                    <Link
                      passHref
                      href={`/movie/${value.title.replace(/\s/g, "-")}?year=${
                        value.release_date && value.release_date.split("-")[0]
                      }&id=${value.id}`}
                    >
                      <button
                        className="text-left w-full hover:bg-dark-light p-2 rounded"
                        type="button"
                        onClick={() => setQuery("")}
                      >
                        <div className="flex">
                          <div className="flex-grow">
                            <Image
                              alt={value.title}
                              blurDataURL={`https://image.tmdb.org/t/p/w100${value.poster_path}`}
                              className="rounded"
                              height="100"
                              src={`https://image.tmdb.org/t/p/w300${value.poster_path}`}
                              width="60"
                            />
                          </div>
                          <div className=" flex-grow w-full ml-5">
                            <Typography variant="h4">{value.title} </Typography>
                            <Typography>
                              {value.release_date &&
                                value.release_date.split("-")[0]}
                            </Typography>
                          </div>
                        </div>
                      </button>
                    </Link>
                  </li>
                ))}
            </div>
            <div>
              <button
                className="hover:bg-dark-light flex w-full p-2 text-left rounded"
                type="button"
                onClick={() => setCollapseTv(!collapseTv)}
              >
                <Typography className="flex-grow" variant="h3">
                  TV
                </Typography>
                <span className="material-icons-outlined">
                  {!collapseTv ? "expand_less" : "expand_more"}
                </span>
              </button>
              {!collapseTv &&
                tv.map((value) => (
                  <li key={value.id}>
                    <Link
                      passHref
                      href={`/tv/${value.name.replace(/\s/g, "-")}?year=${
                        value.first_air_date
                          ? value.first_air_date.split("-")[0]
                          : null
                      }&id=${value.id}`}
                    >
                      <button
                        className="text-left w-full hover:bg-dark-light p-2 rounded"
                        type="button"
                        onClick={() => setQuery("")}
                      >
                        <div className="flex">
                          <div className="flex-grow">
                            <Image
                              alt={value.name}
                              blurDataURL={`https://image.tmdb.org/t/p/w100${value.poster_path}`}
                              className="rounded"
                              height="100"
                              src={`https://image.tmdb.org/t/p/w300${value.poster_path}`}
                              width="60"
                            />
                          </div>
                          <div className=" flex-grow w-full ml-5">
                            <Typography variant="h4">{value.name} </Typography>
                            <Typography>
                              {value.first_air_date.split("-")[0]}
                            </Typography>
                          </div>
                        </div>
                      </button>
                    </Link>
                  </li>
                ))}
            </div>
            <div>
              <button
                className="hover:bg-dark-light flex w-full p-2 text-left rounded"
                type="button"
                onClick={() => setCollapsePeople(!collapsePeople)}
              >
                <Typography className="flex-grow" variant="h3">
                  People
                </Typography>
                <span className="material-icons-outlined">
                  {!collapsePeople ? "expand_less" : "expand_more"}
                </span>
              </button>
              {!collapsePeople &&
                people.map((value) => (
                  <li key={value.id}>
                    <Link
                      passHref
                      href={`/people/${value.name.replace(/\s/g, "-")}?id=${
                        value.id
                      }`}
                    >
                      <button
                        className="text-left w-full hover:bg-dark-light p-2 rounded"
                        type="button"
                        onClick={() => setQuery("")}
                      >
                        <div className="flex">
                          <div className="flex-grow">
                            <Image
                              alt={value.name}
                              blurDataURL={`https://image.tmdb.org/t/p/w100${value.profile_path}`}
                              className="rounded"
                              height="100"
                              src={`https://image.tmdb.org/t/p/w300${value.profile_path}`}
                              width="60"
                            />
                          </div>
                          <div className="flex-grow w-full ml-5">
                            <Typography variant="h4">{value.name} </Typography>
                            <Typography>{value.known_for[0] && value.known_for[0].name}</Typography>
                          </div>
                        </div>
                      </button>
                    </Link>
                  </li>
                ))}
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
