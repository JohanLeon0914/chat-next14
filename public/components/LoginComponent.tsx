"use client";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth/cordova";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import firebase_app from '../../firebaseconfig'
import { useRouter } from 'next/navigation'

const auth = getAuth(firebase_app);

const LoginComponent = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const router = useRouter()

  type FormValues = {
    email: string;
    password: string;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if(userCredential.user){
        localStorage.setItem('user', JSON.stringify(userCredential.user));
        router.push('/dashboard', { scroll: false })
      } 
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const onSubmit = (data: FormValues) => {
    signIn(data.email, data.password)
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
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
          <button
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm">
          If you don't have an account,{" "}
          <Link href="/register">you can register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
