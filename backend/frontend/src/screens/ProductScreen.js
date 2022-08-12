import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { createProductReview, listProductDetails } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'


function ProductScreen() {
  const productId = useParams().id
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const productDetails = useSelector(state => state.productDetails)
  const { error, loading, product } = productDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productCreateReview = useSelector(state => state.productCreateReview)
  const {
    success: successProductCreateReview,
    loading: loadingProductCreateReview,
    error: errorProductCreateReview
  } = productCreateReview

  useEffect(() => {
    if (successProductCreateReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(productId))
  } , [dispatch, productId, navigate, successProductCreateReview])

  const handleAddToCart = () => {
    const params = {qty: qty}
    navigate({
      pathname: `/cart/${productId}`,
      search: `?${createSearchParams(params)}`,
    })
  }

  const handleAddReview = (e) => {
    e.preventDefault()
    dispatch(createProductReview(productId, {rating: rating, comment: comment}))
  }

  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Go Back</Link>
      {
        loading
          ? <Loader />
          : error
            ? <Message variant="danger">{error}</Message>
            : (
              <div>
                <Row>
                  <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid />
                  </Col>
                  <Col md={3}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h3>{product.name}</h3>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Price ${product.price}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Description: {product.description}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={3}>
                    <Card>
                      <ListGroup variant='flush'>
                        <ListGroup.Item>
                          <Row>
                            <Col>Price:</Col>
                            <Col>
                              <strong>${product.price}</strong>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Status:</Col>
                            <Col>
                              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        {product.countInStock > 0 && (
                          <ListGroup.Item>
                            <Row>
                              <Col>Qty:</Col>
                              <Col xs='auto' className='my-1'>
                                <Form.Control
                                  as='select'
                                  type='number'
                                  value={qty}
                                  onChange={(e) => setQty(e.target.value)}
                                >
                                  {[...Array(product.countInStock).keys()]
                                    .map(x => (
                                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))
                                  }
                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                          <Button
                            className='btn-block'
                            disabled={product.countInStock === 0}
                            type='button'
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </Button>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h4>Reviews</h4>
                    {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}
                    <ListGroup variant='flush'>
                      {product.reviews.map(review => (
                        <ListGroup.Item key={review._id}>
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} text={review.review} color={'#f8e825'} />
                          <p>{review.createdAt.slice(0, 10)}</p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                      <ListGroup.Item className='my-3'>
                        <h4>Write a review</h4>
                        {loadingProductCreateReview && <Loader />}
                        {errorProductCreateReview && <Message variant='danger'>{errorProductCreateReview}</Message>}
                        {successProductCreateReview && <Message variant='success'>Review Submitted!</Message>}
                        {userInfo ? (
                          <Form onSubmit={handleAddReview}>
                            <Form.Group controlId='rating' className='mb-3'>
                              <Form.Label>Rating</Form.Label>
                              <Form.Control
                                as='select'
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                              >
                                <option value={''}>Select Rating</option>
                                <option value={'1'}>1 - Poor</option>
                                <option value={'2'}>2 - Fair</option>
                                <option value={'3'}>3 - Good</option>
                                <option value={'4'}>4 - Very Good</option>
                                <option value={'5'}>5 - Excellent</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='comment' className='mb-3'>
                              <Form.Label>Comment</Form.Label>
                              <Form.Control
                                as='textarea'
                                rows='5'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </Form.Group>
                            <Button
                              className='btn-block'
                              disabled={!rating || !comment}
                              type='submit'
                            >
                              Submit
                            </Button>
                          </Form>
                        ) : (
                          <Message variant='info'>
                            Please <Link to='/login'>login</Link> to write a review.
                          </Message>
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </div>
            )
      }
      
    </div>
  )
}

export default ProductScreen