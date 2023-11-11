"use client"
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase_app, { db } from '../../firebaseconfig'
import { useRouter } from 'next/navigation'
import { addDoc, collection } from 'firebase/firestore';

const auth = getAuth(firebase_app);


type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>();
  const usersCollection = collection(db, "users")
  const router = useRouter()

  const signUp = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await addDoc(usersCollection, {
          id: res.user.uid,
          email: res.user.email
        })
        localStorage.setItem('user', JSON.stringify(res.user));
        router.push('/login', { scroll: false })
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    signUp(data.email, data.password)
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  type="password"
                  placeholder="Password"
                  required
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  />
                )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
          </div>
          <button
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm">
          If you already have an account,{' '}
          <Link href="/login">
            you can sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;