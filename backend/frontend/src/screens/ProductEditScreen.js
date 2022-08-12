import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'


import Loader from '../components/Loader'
import Message from '../components/Message'

import FormContainer from '../components/FormContainer'

import { listProductDetails, updateProduct } from '../actions/productActions'

import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import axios from 'axios'

function ProductEditScreen() {
  const productId = useParams().id
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  
  const productDetails = useSelector(state => state.productDetails)
  const { error, loading, product } = productDetails
  
  const productUpdate = useSelector(state => state.productUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate({
        pathname: '/admin/productlist'
      })
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [product, productId, dispatch, navigate, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    // update product
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }))
  }

  const uploadFileHandler = async (e) => {
    console.log('uploading')
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('image', file)
    formData.append('product_id', productId)

    setUploading(true)

    try {
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }

      const { data } = await axios
        .post(
          '/api/products/upload/',
          formData,
          config
        )
      setImage(data)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }

  }

  return (
    <div className="container">
      <Link to="/admin/productlist">Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading
          ? <Loader />
          : error
            ? <Message variant='danger'>{error}</Message>
            : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='mb-3'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter name'
                  />
                </Form.Group>
                <Form.Group controlId='price' className='mb-3'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder='Enter price'
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter image'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <Form.Control
                    type='file'
                    id='image-file'
                    label='Choose Image'
                    onChange={uploadFileHandler}
                  />
                  {uploading && <Loader />}
                </Form.Group>
                <Form.Group controlId='brand' className='mb-3'>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type='text'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder='Enter brand'
                  />
                </Form.Group>
                <Form.Group controlId='category' className='mb-3'>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type='text'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder='Enter category'
                  />
                </Form.Group>
                <Form.Group controlId='countInStock' className='mb-3'>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type='number'
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    placeholder='Enter stock'
                  />
                </Form.Group>
                <Form.Group controlId='description' className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Enter description'
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

export default ProductEditScreen
