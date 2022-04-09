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
    <div className="flex items-center justify-center h-screen w-screen p-7">
      <div className="bg-dark-components text-dark-text max-w-[400px] w-full rounded p-5 flex flex-col text-left">
        <Typography className="mb-5" variant="h1">
          Login
        </Typography>
        <div className=" divide-y">
          <button
            className="w-full p-2 space-x-3 rounded my-4 bg-dark-light text-dark-text flex items-center justify-center"
            type="button"
            onClick={google}
          >
            <img alt="google" className="rounded" src="/img/google_icon.svg" />
            <Typography>Login with Google</Typography>
          </button>
          <form className="flex flex-col space-y-4" onSubmit={submit}>
            <div className="pt-2">
              <Typography>Email * </Typography>
              <input
                className="bg-dark-light w-full mt-2 rounded p-2 text-dark-text"
                placeholder="email"
                type="email"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div>
              <Typography>Password *</Typography>
              <input
                className="bg-dark-light mt-2 rounded w-full p-2 text-dark-text"
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <button className="bg-dark-light mt-2 p-2 rounded" type="submit">
              Submit
            </button>
          </form>
        </div>

        <Link passHref href="/register">
          <a className=" text-center text-blue-400 mt-4">
            <Typography>need a account?</Typography>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
