import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/modals/LoginForm'
import { type ModalHeaderProps } from '../components/modals/Modal';

// TODO: redirect to events/index page after successful login; merge with LoginModal?
function Login() {
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined} as Partial<ModalHeaderProps>);

  const updateHeader = (e: Partial<ModalHeaderProps>) => { setHeader({...e}) }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper w-full">
      <h1 className="font-display text-2xl font-semibold text-ink">{header.title}</h1>
      <LoginForm 
        onChangeMode={updateHeader}
        onClose={() => {}}
      />
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
