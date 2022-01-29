import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useState } from 'react';

import Typography from '../components/typography';
import { useAuth } from '../context/AuthUserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithEmailAndPassword } = useAuth();
  const router = useRouter();
  const submit = (event: any) => {
    event.preventDefault();
    signInWithEmailAndPassword(email, password).then(() => router.push('/'));
  };

  const google = async () => {
    await signInWithGoogle();

    router.push('/');
  };

  return (
    <div className=" flex items-center justify-center h-screen w-screen">
      <div className=" bg-dark-components text-dark-text w-max rounded p-5 flex flex-col text-center">
        <Typography className="mb-5" variant="h1">
          Login
        </Typography>
        <form className="flex flex-col space-y-4" onSubmit={submit}>
          <input
            className="bg-dark-light rounded p-2 text-dark-text"
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <input
            className="bg-dark-light rounded p-2 text-dark-text"
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <button className="bg-dark-light p-2 rounded" type="submit">
            Submit
          </button>
        </form>
        <button
          className=" p-2 rounded mt-4 bg-dark-light text-dark-text flex items-center justify-center"
          type="button"
          onClick={google}
        >
          <img alt="google" className="rounded" src="/img/google_icon.svg" />
        </button>
        <Link passHref href="/register">
          <a className=" text-blue-400 mt-4">
            <Typography>need a account?</Typography>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
