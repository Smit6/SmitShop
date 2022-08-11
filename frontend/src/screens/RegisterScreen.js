import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'

import FormContainer from '../components/FormContainer'

function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()

  let [searchParams, setSearchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const userRegister = useSelector(state => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo) {
      navigate({
        pathname: `${redirect}`
      })
    }
  } , [redirect, userInfo, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter name'
          />
        </Form.Group>
        <Form.Group controlId='email' className='mt-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
          />
        </Form.Group>
        <Form.Group controlId='password' className='mt-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter Password'
          />
        </Form.Group>
        <Form.Group controlId='passwordConfirm' className='py-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
          />
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
        >
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account? <Link
            to={redirect?`/login?redirect=${redirect}`:'/login'}
          >
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen