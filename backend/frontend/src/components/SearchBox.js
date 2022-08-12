import React, { useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useHistory, useLocation, useNavigate } from 'react-router-dom'

function SearchBox() {
  const [keyword, setKeyword] = useState('')

  // let history = useHistory()
  const navigate = useNavigate()

  const location = useLocation()

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`)
      // history.push(`/?keyword=${keyword}`)
    } else {
      // history.push('/')
      navigate(location.pathname)
    }
  }

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col>
          <Form.Control
            type='text'
            name='q'
            onChange={(e) => setKeyword(e.target.value)}
            className='mr-sm-2'
          />
        </Col>
        <Col>
          <Button
            variant='outline-success'
            type='submit'
            className='p-2'
          >
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBox


