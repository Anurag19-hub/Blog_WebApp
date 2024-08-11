import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {

  const [formData, setFormData] = useState({});

//So,inside the signin and signup page firstly, we just use these below piece of state and loading to handle the possible different things but now we we do not want to use this things As, we want to use our Redux toolkit inorder to use it we need to import those functions, which are in userSlice.js
  // So, first import:_ import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';this and to use this we need to dispatch them for that we have to import as we have to dispatch all the logics :- import { useDispatch } from 'react-redux';

  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);

//in useSlice we've initialState and in it we've error and  errorMessage we've in this same page in alert
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    //console.log(e.target.value);
    // ... :- spread operator, when user enter the values in the form then it should be seen all the feilds value
    setFormData({...formData, [e.target.id]: e.target.value.trim() });
  };
  //console.log(formData);

  //we use async as we are going to submit it to the database and it takes time we need to use weight So, in this way we need to change this function to be asynchronous.
  //we want to prevent the default behavior of the form because when we submit the form Normally the form is going to be refreshed the page or going to be refresh so using this preventDefault() we can stop to refresh the page.

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(!formData.email || !formData.password)
    {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      
//Now we know we have made one file userSlice.js and apply all the logics in it of loading and error so instead of below code simply we can use that logics here simply as that:- dispatch(signInStart());
      // setLoading(true);
      // setErrorMessage(null);
      
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if(data.success === false)
      {
        //return setErrorMessage(data.message); in userSlice we've action.payoad here we've used that using another name data
        dispatch(signInFailure(data.message));
      }

      //setLoading(false);
      if(res.ok)
      {
        dispatch(signInSuccess(data));
        navigate('/');
      }
      
    } catch (error) {

        // return setErrorMessage(data.message);
        // setLoading(false);
        dispatch(signInFailure(error.message));
    }
  };


  return (
  <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center
        gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'
          >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              rounded-lg text-white'>
              BeUnique
            </span>
          Blog
          </Link>

          <p className='text-sm mt-5'>
            You can sign in with your email and password or with Google.
          </p>

        </div>

        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='name@comapany.com'
                id='email'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>


            <OAuth />



          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              SignUp
            </Link>
          </div>

          {
            errorMessage && (
              
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }


        </div>
      </div>
    </div>
  )
    
}
