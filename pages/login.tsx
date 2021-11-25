import { useRouter } from 'next/dist/client/router';
import { FormEventHandler, useEffect, useState } from 'react';
import RateList from '../components/rating/rateList';
import Typography from '../components/typography';
import { useAuth } from '../context/AuthUserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { createUserWithEmailAndPassword } = useAuth();
  const router = useRouter();
  const submit = (event: any) => {
    event.preventDefault();
    createUserWithEmailAndPassword(email, password).then((value) =>
      router.push('/')
    );
  };

  return (
    <div>
      <Typography>Login</Typography>
      <form onSubmit={submit}>
        <input
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder='email'
          type='email'
        />
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          type='password'
          placeholder='password'
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Login;
