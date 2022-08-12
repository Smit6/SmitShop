import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'

import Paginate from '../components/Paginate'

import { register } from '../actions/userActions'

import FormContainer from '../components/FormContainer'

import { listProducts, deleteProduct, createProduct } from '../actions/productActions'

import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {
  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const { products, pages, page, loading, error } = productList

  const productDelete = useSelector(state => state.productDelete)
  const { success: successDelete, loading: loadingDelete, error: errorDelete } = productDelete

  const productCreate = useSelector(state => state.productCreate)
  const { success: successCreate, loading: loadingCreate, error: errorCreate, product: createdProduct } = productCreate

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const navigate = useNavigate()

  let keyword = useLocation().search
  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })
    if (!userInfo.isAdmin) {
      navigate({
        pathname: `/login`
      })
    }

    if (successCreate) {
      navigate({
        pathname: `/admin/product/${createdProduct._id}/edit`
      })
    } else {
      dispatch(listProducts(keyword))
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete product
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading
        ? <Loader />
        : error
          ? <Message variant="danger">{error}</Message>
          : (
            <div>
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <td>ID</td>
                  <td>NAME</td>
                  <td>PRICE</td>
                  <td>CATEGORY</td>
                  <td>BRAND</td>
                  <td></td>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                          <Button variant='light' className='btn-sm'>
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='danger'
                          className='btn-sm'
                          onClick={() => deleteHandler(product._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Paginate pages={pages} page={page} isAdmin={true} />
            </div>
          )
      }
    </div>
  )
}

export default ProductListScreen