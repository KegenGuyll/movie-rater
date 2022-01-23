import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useState } from 'react';
import Typography from '../components/typography';
import { useAuth } from '../context/AuthUserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { createUserWithEmailAndPassword, signInWithGoogle } = useAuth();
  const router = useRouter();
  const submit = (event: any) => {
    event.preventDefault();
    createUserWithEmailAndPassword(email, password).then((value) =>
      router.push('/')
    );
  };

  const google = async () => {
    await signInWithGoogle();

    router.push('/');
  };

  return (
    <div className=' flex items-center justify-center h-screen w-screen'>
      <div className=' bg-dark-components text-dark-text w-max rounded p-5 flex flex-col text-center'>
        <Typography className='mb-5' variant='h1'>
          Register
        </Typography>
        <form className='flex flex-col space-y-4' onSubmit={submit}>
          <input
            className='bg-dark-light rounded p-2 text-dark-text'
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder='email'
            type='email'
          />
          <input
            className='bg-dark-light rounded p-2 text-dark-text'
            onChange={(e) => setPassword(e.currentTarget.value)}
            type='password'
            placeholder='password'
          />
          <button className='bg-dark-light p-2 rounded' type='submit'>
            Submit
          </button>
        </form>
        <button
          className=' p-2 rounded mt-4 bg-dark-light text-dark-text flex items-center justify-center'
          onClick={google}>
          <img className='rounded' src='/img/google_icon.svg' />
        </button>
        <Link passHref href={'/login'}>
          <a className=' text-blue-400 mt-4'>
            <Typography>already have an account?</Typography>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
