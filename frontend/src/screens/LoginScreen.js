import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'

import FormContainer from '../components/FormContainer'

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  let [searchParams, setSearchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const userLogin = useSelector(state => state.userLogin)
  const { loading, error, userInfo } = userLogin

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
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
          />
        </Form.Group>
        <Form.Group controlId='password' className='py-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter Password'
          />
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
        >
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer? <Link
            to={redirect?`/register?redirect=${redirect}`:'/register'}
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen