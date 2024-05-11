import React, { useEffect, useRef, useState } from 'react'
import AuthService from 'services/auth.service';
import { isEmail, isStrongPassword } from "validator";
import EventBus from "../../common/EventBus";
import eventBus from '../../common/EventBus';
import TransactionService from 'services/transaction.service';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    eventBus.on('exit', () => {
        setMessage('');
        setSuccessful(false);
    })
    return () => {
      EventBus.remove("exit");
    };
  }, []);
  
  const validEmail = (value: string) => {
    if (!isEmail(value)) {
      setError(x => x += '<br>Вы ввели невалидный e-mail.')
      return false;
    }
    return true;
  };
  
  const validPassword = (value: string) => {
    if (!isStrongPassword(value, {
      minLength: 8,
      minNumbers: 2,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    })) {
      setError(x => x += `<br>Пароль должен содержать минимум 8 символов, 
          <br>включая 2 цифры, 1 букву в нижнем регистре, 
          <br>1 букву в верхнем регистре,
          <br>1 спецсимвол.`)
          return false;
    }
    return true;
  };

  const refPassworsd = useRef(null);
  const refEmail = useRef(null);

  const LoginForm = () => {

    const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      //@ts-ignore
      const email = refEmail.current.value;//@ts-ignore
      const password = refPassworsd.current.value;

      if(validEmail(email) && validPassword(password)) {
        setMessage('');
        AuthService.login(email, password).then(
          (response) => {
            
            setMessage(`${response.user.firstName}, с возвращением!`);
            EventBus.dispatch("login");
            setSuccessful(true);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
  
            setError(`Ошбка работы с данными: ${resMessage}.`);
            setSuccessful(false);
          }
        );
      }
    }

    return (
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/3 items-center max-w-4xl transition duration-1000 ease-out">
        <h2 className='p-3 text-2xl font-bold text-pink-400'>Авторизация</h2>
        <div className="inline-block border-[1px] justify-center w-20 border-blue-400 border-solid"></div>
        <h3 className='text-xl font-semibold text-blue-400 pt-2'>Sign In!</h3>
        {/* Inputs */}
        <form
            onSubmit={(event) => handleClick(event)}
            className="flex flex-col items-center justify-center px-3"
        >
          <input ref={refEmail} required name='name' type='email' className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Email'></input>
          <input ref={refPassworsd} required name="password" type="password" className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Password'></input>
          <button className='rounded-2xl m-2 text-white bg-blue-400 w-4/5 px-4 py-2 shadow-md hover:text-blue-400 hover:bg-white transition duration-200 ease-in'>
            Sign In
          </button>
        </form>
        <div className="inline-block border-[1px] justify-center w-20 border-blue-400 border-solid"></div>
        <p className='text-blue-400 mt-4 text-sm'>Вы не зарегистрированы?</p>
        <p className='text-blue-400 mb-4 text-sm font-medium cursor-pointer' onClick={() => setIsLogin(false)}>Создать аккаунт?</p>
      </div>
    )
  }

  const SignUpForm = () => {
    const validUsername = (value: string) => {
      if (value.length < 3 || value.length > 20) {
        setError(x => x += '<br>Имя должно содержать не менее 3 символов и не более 20.')
        return false;
      }
      return true;
    };

    const validRepPassword = (value: string) => {
      //@ts-ignore
      if (refPassworsd.current.value !== value) {
        setError(x => x += '<br>Введенные пароли не совпрадают.')
        return false;
      }
      return true;
    }
    const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      //@ts-ignore
      const userFirstName = refFirstName.current.value; //@ts-ignore
      const userLastName = refLastName.current.value; //@ts-ignore
      const email = refEmail.current.value;//@ts-ignore
      const password = refPassworsd.current.value;
      
      if(
        validEmail(email)
        && validPassword(password)
        && validUsername(userFirstName)//@ts-ignore
        && validUsername(userLastName)//@ts-ignore
        && validRepPassword(refRepPassworsd.current.value)
      ) {
        setMessage('');
        AuthService.register(userFirstName, userLastName, email, password).then(
          (response) => {
            setMessage(`${response.user.firstName}, поздравляем вы зарегестрированы!`);
            setSuccessful(true);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
  
            setError(`Ошбка работы с данными: ${resMessage}.`);
            setSuccessful(false);
          }
        );
      }
    }
    const refRepPassworsd = useRef(null);
    const refFirstName = useRef(null);
    const refLastName = useRef(null);
    return (
      <div className="bg-blue-400 text-white rounded-2xl shadow-2xl  flex flex-col w-full  md:w-1/3 items-center max-w-4xl transition duration-1000 ease-in">
        <h2 className='p-3 text-2xl font-bold text-white'>Авторизация</h2>
        <div className="inline-block border-[1px] justify-center w-20 border-white border-solid"></div>
        <h3 className='text-xl font-semibold text-white pt-2'>Create Account!</h3>
        {/* Inputs */}
        <form
            onSubmit={(event) => handleClick(event)}
            className="flex flex-col items-center justify-center mt-2 px-3 text-black"
        >
          <input ref={refFirstName} type="text" className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='First Name'></input>
          <input ref={refLastName} type="text" className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Last Name'></input>
          <input ref={refEmail} type='email' className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Email'></input>
          <input ref={refPassworsd} type="password" className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Password'></input>
          <input ref={refRepPassworsd}  type="password" className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0' placeholder='Password'></input>
          <button className='rounded-2xl m-4 text-blue-400 bg-white w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-blue-400 transition duration-200 ease-in'>
            Sign Up
          </button>
        </form>
        <div className="inline-block border-[1px] justify-center w-20 border-white border-solid"></div>
        <p className='text-white mt-4 text-sm'>Already have an account?</p>
        <p className='text-white mb-4 text-sm font-medium cursor-pointer' onClick={() => setIsLogin(true)}>Sign In to your Account?</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen md:py-2">
      { error && <h2 className='text-xl text-red-600' >Допушены ошибки</h2> }
      <p dangerouslySetInnerHTML={{ __html: error }} />
      <main className="flex items-center w-full px-2 md:px-20">
        <div className="hidden md:inline-flex flex-col flex-1 space-y-1">
          <p className='text-6xl text-blue-500 font-bold'>Сервис анализа финансов</p>
          <p className='font-medium text-lg leading-1 text-pink-400'>Авторизуйтесть, чтобы воспользоваться сервисом.</p>
        </div>
        {
          isLogin ? (
            <LoginForm />
          ) : (
            <SignUpForm />
          )
        }
      </main>
      <div className="hidden md:inline-flex flex-col flex-1 space-y-1">
        { successful && message && <p className='px-3 m-5 text-green-500'>{message}</p>}
        </div>
    </div>
  )
}

export default Auth

