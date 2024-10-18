import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { useParams } from 'react-router-dom';
import "./ProductDetails.css"; // Create this CSS file for styling

const fetchProductById = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/store-servlet/api/products/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
};

const fetchReviews = async (name) => {
  try {
    const response = await fetch(`http://localhost:8080/store-servlet/api/getReviews?productId=${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

const postReview = async (reviewData,product,purchasedItem) => {
  try {
    reviewData.ProductModelName=product.productName;
    reviewData.ProductCategory=product.productCategory;
    reviewData.ProductPrice=product.productPrice;
    reviewData.StoreAddress=purchasedItem.storeAddr;

    const response = await fetch('http://localhost:8080/store-servlet/api/getReviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Failed to post review');
    }

    alert('Review submitted successfully!');
    window.location.reload();
    // alert.(reviewData);
    //console.table("here is the reviewdata: " +reviewData);
    // console.log(JSON.stringify(reviewData, null, 2));
  } catch (error) {
    console.error('Error posting review:', error);
  }
};

const checkIfPurchased = async (userId, productId,setPurchasedItem) => {
  try {
    const response = await fetch('http://localhost:8080/store-servlet/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });
    if (!response.ok) {
      throw new Error('Failed to check purchase status');
    }
    const data = await response.json();
    if(data.purchased === 'true'){
      setPurchasedItem(data.orderDetails);
      return true;
    }
    else return false;
    
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return false;
  }
};

const ProductDetails = () => { // userId passed as a prop
  const { id } = useParams();
  const [purchasedItem, setPurchasedItem] = useState({});
  sessionStorage.setItem('custName', "ashish");
  const custName = sessionStorage.getItem('custName');
  sessionStorage.setItem('custId', 6543);
  const custId = sessionStorage.getItem('custId');
  const { cart, setCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewDetails, setReviewDetails] = useState({
    ProductModelName: '',
    ProductCategory: '',
    ProductPrice:'',
    StoreAddress:'',
    ProductOnSale:'No',
    ManufacturerName:'SmartHomes',
    ManufacturerRebate:'No',
    UserID: custId,
    UserName:custName,
    UserAge: '',
    UserGender: '',
    UserOccupation: '',
    ReviewRating: '',
    ReviewDate: new Date().toLocaleDateString('en-US'),
    ReviewText: '',
  });
  
  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data[0]);
      const reviewsData = await fetchReviews(data[0].productName);
      setReviews(reviewsData);
    };
    loadProduct();
  }, [id,reviewDetails,]);


  // useEffect(() => {
  //   const loadReviews = async () => {
  //     const reviewsData = await fetchReviews(product.productName);
  //     setReviews(reviewsData);
  //   };
  //   loadReviews();
  // }, [reviewDetails]);

  // const loadReviews = async () => {
  //   const reviewsData = await fetchReviews(product.productName);
  //   setReviews(reviewsData);
  // };

  const addToCart = () => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.productId === product.productId);
      if (existingProduct) {
        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const changeQuantity = (delta) => {
    setCart(prevCart => prevCart.map(item =>
      item.productId === product.productId
        ? { ...item, quantity: item.quantity + delta }
        : item
    ).filter(item => item.quantity > 0));
  };

  const handlePostReviewClick = async () => {
    // Check if the user has purchased the product using the API
    const purchased = await checkIfPurchased(custId, product.productId,setPurchasedItem);
    
    if (purchased) {
      setHasPurchased(true);
      setShowReviewForm(true);  // Open the review form popup
    } else {
      alert('You must purchase this product to post a review.');
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmitReview = async () => {
    // Post the review using the postReview function
    postReview(reviewDetails,product,purchasedItem);
    // const reviewsData = await fetchReviews(reviewDetails.ProductModelName);
    // setReviews(reviewsData);
    setShowReviewForm(false);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
    <div className="product-details">
      <div>
        <img src={`${process.env.PUBLIC_URL}/assets/${product.image}`} alt={product.image} />
      </div>
      <div className="details">
        <h1>{product.productName}</h1>
        <p>{product.productDesc}</p>
        <p>${product.productPrice}</p>

        {cart.some(item => item.productId === product.productId) ? (
          <>
            <button onClick={() => changeQuantity(-1)}>-</button>
            <span>{cart.find(item => item.productId === product.productId).quantity}</span>
            <button onClick={() => changeQuantity(1)}>+</button>
          </>
        ) : (
          <button onClick={addToCart}>Add to Cart</button>
        )}
      </div>
      </div>
      <div>
      {/* Post Review Button */}
      <button onClick={handlePostReviewClick}>Post Review</button>

      {/* Review Form Popup */}
      {showReviewForm && hasPurchased && (
        <div className="review-popup">
          <h2>Post your review</h2>
          <label>
            Age:
            <input type="text" name="UserAge" value={reviewDetails.UserAge} onChange={handleReviewChange} />
          </label>
          <br></br>
          <label>
            Gender:
            <input type="text" name="UserGender" value={reviewDetails.UserGender} onChange={handleReviewChange} />
          </label>
          <br></br>
          <label>
            Occupation:
            <input type="text" name="UserOccupation" value={reviewDetails.UserOccupation} onChange={handleReviewChange} />
          </label>
          <br></br>
          <label>
            Rating:
            <input type="text" name="ReviewRating" value={reviewDetails.ReviewRating} onChange={handleReviewChange} />
          </label>
          <br></br>
          <label>
            Review Text:
            <textarea name="ReviewText" value={reviewDetails.ReviewText} onChange={handleReviewChange}></textarea>
          </label>
          <br></br>
          <button onClick={handleSubmitReview}>Submit</button>
          <button onClick={handleCancelReview}>Cancel</button>
        </div>
      )}

      <h2>Reviews</h2>
      { reviews.length > 0 && reviews.map(review => (
        <div key={review.ReviewDate} className="review">
          <p><strong>{review.UserName??review.UserID}</strong></p>
          <p>{new Date(review.ReviewDate).toLocaleDateString()}</p>
          <p>{review.ReviewText}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProductDetails;
