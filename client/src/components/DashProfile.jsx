import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { 
  Alert, 
  Button, 
  Modal, 
  TextInput  
} from 'flowbite-react';

import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';

import { app } from '../firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { 
  updateStart, 
  updateSuccess, 
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  } from '../redux/user/userSlice';

import { useDispatch } from 'react-redux';

import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { Link } from 'react-router-dom';


export default function DashProfile() {


  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  
  const [imageFileUploading, setimageFileUploading] = useState(false);
  const [updateUserSuccess, setupdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  //This form date will be fill out by the information, which is changed by the user.
  const [formData, setFormData] = useState({});

  //console.log(imageFileUploadProgress, imageFileUploadError)

  //TO give choose file button reference on the image click event
  const filePickerRef = useRef();

  const dispatch = useDispatch();

  const handleImageChange = (e) =>{

    const file = e.target.files[0];

    if(file)
    {
      // setImageFile(e.target.files[0]);

      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

//  console.log(imageFile, imageFileUrl);

  useEffect(() =>{

    if(imageFile)
    {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {

    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    //console.log("Uploading Image...");

    setimageFileUploading(true);

    setImageFileUploadError(null);
    

    // This app is came from the firebase.jsx file
    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(

      'state_changed',
      (snapshot) => {

        const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {

        setImageFileUploadError('Could not upload image...');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setimageFileUploading(false);
      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {

          setImageFileUrl(downloadUrl);

          // ...formData = previous data of user
          setFormData({...formData, profilePicture:downloadUrl});

          setimageFileUploading(false);
        });
      }
    );
  };


  const handleChange = (e) => {

    // ...formData = previous data of user and In e.target.id all values like password, username, email
    setFormData({...formData, [e.target.id]: e.target.value});
  };
  
  //console.log(formData);
 
  const handleSubmit = async(e) => {

    e.preventDefault();

    setUpdateUserError(null);
    setupdateUserSuccess(null);

    if(Object.keys(formData).length === 0)
    {
      setUpdateUserError('No Changes made');
      return;
    }

    if(imageFileUploading)
    {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try 
    {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if(!res.ok)
      {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      else
      {
        dispatch(updateSuccess(data));
        setupdateUserSuccess("User's profile updated successfully");
      }
    }
    catch (error) 
    {
      dispatch(updateFailure(error.message));
      setUpdateUserError(data.message);
    }



  };


  const handleDeleteUser = async() => {

    setShowModal(false);

    try 
    {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {

        method: 'DELETE',
      });

      const data = await res.json();
      if(!res.ok)
      {
        dispatch(deleteUserFailure(data.message));
      }
      else
      {
        dispatch(deleteUserSuccess(data));
      }

    } 
    catch (error) 
    {

      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async() => {

    try 
    {
      const res = await fetch('/api/user/signout', {

        method: 'POST',
      });  
      const data = await res.json();

      if(!res.ok)
      {
        console.log(data.message);
      }
      else
      {
        dispatch(signoutSuccess());
      }
    } 
    catch (error) 
    {
      console.log(error.message);
    }
  }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'> Profile </h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

      {/*  ---> image/* => This star showcase it'll accept all type of images   */}
        
        <input 
          type="file" 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickerRef} 
          hidden
        />

        <div 
          className='relative w-32 h-32 self-center cursor-pointer shadow-md 
          overflow-hidden rounded-full' 
          onClick={() => filePickerRef.current.click() } 
        >

          {imageFileUploadProgress && (

            <CircularProgressbar 
            
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles= {{
                  root:{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {

                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
            />

          )}
          
          <img 
            //src={ currentUser.profilePicture } 
            src={imageFileUrl || currentUser.profilePicture}
            alt="userImage" 
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}
            `} 
          />
        </div>

        {imageFileUploadError && ( <Alert color='failure'>{imageFileUploadError}</Alert>)}

        
        <TextInput 
          type='text' 
          id='username' 
          placeholder='Username'
          defaultValue={ currentUser.username }
          onChange={handleChange} 
        />

        <TextInput 
          type='email' 
          id='email' 
          placeholder='Email'
          defaultValue={ currentUser.email }
          onChange={handleChange} 
        />

        <TextInput 
          type='password' 
          id='password' 
          placeholder='Password'
          onChange={handleChange}
        />

      <Button 
        type='submit' 
        gradientDuoTone='purpleToBlue' 
        outline
        disabled={loading || imageFileUploading}
      >
        {loading ? 'Loading...' : 'Update'}
      </Button>

      {
        currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )
      }


      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>
          Delete Account?
        </span>
        <span className='cursor-pointer' onClick={handleSignout}>
          Sign Out
        </span>
      </div>

      { updateUserSuccess && (

        <Alert color='success' className='mt-5'>
          { updateUserSuccess }
        </Alert>
      )}

      { updateUserError && (

        <Alert color='failure' className='mt-5'>
          { updateUserError }
        </Alert>
      )}

      { error && (

      <Alert color='failure' className='mt-5'>
        { error }
      </Alert>
      )}

      <Modal 
        show={showModal} 
        onClose={ ()=> setShowModal(false) }
        popup 
        size='md'
      >

        <Modal.Header />

        <Modal.Body>

          <div className="text-center">

            <HiOutlineExclamationCircle 
              className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'
            />

            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure? You want to delete your Account?? 
            </h3>

            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I am Sure.
              </Button>

              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>

          </div>

        </Modal.Body>

      </Modal>




    </div>
  );
}
