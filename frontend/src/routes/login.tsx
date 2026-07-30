import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/modals/LoginForm'
import { type ModalHeaderProps } from '../components/modals/Modal';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const auth = useAuth();
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined} as Partial<ModalHeaderProps>); // login | password | email

  const updateHeader = (e: Partial<ModalHeaderProps>) => { setHeader({...e}) }

  const onSubmit = ({ username, password }: any) => {
    auth.login(username, password);
  }

  // const doLogin = async () => {
  //   // FIXME: THIS IS BAD REACT, COMPONENT SHOULD NOT CALL THIS NON-LOCAL FUNCTION
  //   await auth.login(creds.email, creds.password).then(() => {
  //     console.log(auth);
  //     toast(`Welcome back, ${auth.user.username}`);
  //     onClose();
  //   }).catch(() => setErr("Authentication failed"));
  // };
  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper w-full">
      <h1 className="font-display text-2xl font-semibold text-ink">{header.title}</h1>
      <LoginForm 
        updateParent={updateHeader}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
