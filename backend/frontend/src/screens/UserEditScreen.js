import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUser } from '../actions/userActions'

import FormContainer from '../components/FormContainer'

import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
  const userId = useParams().id
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  
  const userDetails = useSelector(state => state.userDetails)
  const { error, loading, user } = userDetails

  const userUpdate = useSelector(state => state.userUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate({
        pathname: '/admin/userlist'
      })
    } else {
      if (!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [user, userId, dispatch, navigate, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({
      _id: user._id,
      name,
      email,
      isAdmin,
    }))
  }

  return (
    <div className="container">
      <Link to="/admin/userlist">Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading
          ? <Loader />
          : error
            ? <Message variant='danger'>{error}</Message>
            : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter name'
                  />
                </Form.Group>
                <Form.Group controlId='email' className='mt-3'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter email'
                  />
                </Form.Group>
                <Form.Group controlId='isadmin' className='my-3'>
                  <Form.Check
                    type='checkbox'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    label='Is Admin?'
                  />
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                >
                  Update
                </Button>
              </Form>
            )
        }
        
      </FormContainer>
    </div>
  )
}

export default UserEditScreen
