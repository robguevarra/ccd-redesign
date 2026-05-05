import { LoginForm } from './login-form';

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 md:px-8 py-16 md:py-24">
      <h1 className="font-serif text-3xl text-stone-900 mb-2">Welcome back.</h1>
      <p className="text-stone-600 mb-10">
        Sign in to publish posts and review appointment requests.
      </p>
      <LoginForm />
    </div>
  );
}
