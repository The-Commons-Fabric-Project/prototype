import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/login/LoginForm'
import { type ModalHeaderProps } from '../components/overlays-feedback/Modal';

function Login() {
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined}); // login | password | email

  const updateHeader = (e: Partial<ModalHeaderProps>) => { setHeader({...e}) }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper">
      <h1 className="font-display text-2xl font-semibold text-ink">{header.title}</h1>
      <LoginForm 
        updateParent={updateHeader}
      />
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
