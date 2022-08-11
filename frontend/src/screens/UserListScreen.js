import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'

import FormContainer from '../components/FormContainer'

import { listUsers, deleteUser } from '../actions/userActions'

function UserListScreen() {
  const dispatch = useDispatch()

  const userList = useSelector(state => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector(state => state.userDelete)
  const { success: successDelete } = userDelete

  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate({
        pathname: `/login`
      })
    }
  }, [dispatch, navigate, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <div>
      <h1>User List</h1>
      {loading
        ? <Loader />
        : error
          ? <Message variant="danger">{error}</Message>
          : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <td>ID</td>
                <td>NAME</td>
                <td>EMAIL</td>
                <td>ADMIN</td>
                <td></td>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isAdmin
                        ? <i className="fas fa-check" style={{ color: 'green' }}></i>
                        : <i className="fas fa-times" style={{ color: 'red' }}></i>
                      }
                    </td>
                    <td>
                      <LinkContainer to={`/user/${user.id}`}>
                        <Button variant="primary">View</Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <LinkContainer to={`/admin/user/${user.id}`}>
                        <Button variant='light' className='btn-sm'>
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
      }
    </div>
  )
}

export default UserListScreen