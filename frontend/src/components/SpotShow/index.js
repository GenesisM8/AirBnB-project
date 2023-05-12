import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singleSpotThunk, clearSpotsAction } from '../../store/spots';
import { loadReviewThunk } from "../../store/reviews";
import './SpotShow.css'
import { useParams } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/index'
import CreateReviewModal from "../CreateReview";

const SpotShow = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.singleSpot)
    let reviews = useSelector(state => state.reviews.reviews);
    reviews = Object.values(reviews);//array
    let user = useSelector(state => state.session.user);
    // console.log("reviews here!!: reviews")


    const firstReview = (user, reviews, spot) => {
        if (user === null || user === undefined) return false; //=> Need to log in to post a review
        if (Boolean(reviews.length)) return false; // => checks if reviews already exit 
        if (user.id === spot.ownerId) return false; //=>// => You can't write a review for your own spot
        return true;
    }

    const postReviewButton = (user, reviews, spot) => {
        if (user === null || user === undefined) return false; //=> Need to log in to post a review
        for (let review of reviews) {
            if (review.userId === user.id) // =>Can't post a second review
                return false;
        }
        if (user.id === spot.ownerId) return false;// => You can't write a review for your own spot

        return true;
    }

    const reviewNum = (num) => {
        if (num === 1) return "1 review"
        else return ` ${num} reviews`
    }

    const reviewMonthYear = (moment) => {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let created = new Date(moment);
        let result = `${months[created.getMonth()]} ${created.getFullYear()}`
        return result;
    }

    useEffect(() => {
        dispatch(singleSpotThunk(spotId))
        dispatch(loadReviewThunk(spotId))
        return (() => dispatch(clearSpotsAction()))
    }, [dispatch, spotId])


    if (!spot) return null;

    if (!spot.SpotImages) return null;
    if (!spot.Owner) return (<h1>Owner not Found...</h1>)
    if (!reviews) return null

    return (
        <>
            <div className='fullPageShow'>
                <div >
                    <h1>{spot.name}</h1>
                    <p>{spot.city}, {spot.state}.</p>
                    <div className='showContainer'>
                        <div>
                            <img src={spot.SpotImages[0].url} alt='firstImg' className='imgShowLeft' />
                        </div>
                        <div className='rightContainerShow'>
                            <div className='smallImg'>
                                <img src={spot.SpotImages[1].url} alt='spotsImgs' className='imgShowRight' />
                                <img src={spot.SpotImages[2].url} alt='spotsImgs' className='imgShowRight' />
                            </div>
                            <div className='smallImg'>
                                <img src={spot.SpotImages[3].url} alt='spotsImgs' className='imgShowRight' />
                                <img src={spot.SpotImages[1].url} alt='spotsImgs' className='imgShowRight' />
                            </div>

                        </div>
                    </div>


                    <div className='spotDetails'>
                        <div className='hostedText'>
                            <h2> Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                            <p>{spot.description}</p>
                        </div>
                        <div className='reserveContainer'>
                            <div className='priceInfo'>
                                <p>${spot.price} night</p>
                                {spot.avgStarRating === 'NaN' ?
                                    <div className='number'>
                                        <i class="fa-sharp fa-solid fa-star"></i>
                                        <h4> New </h4>
                                    </div>
                                    : (
                                        <div className='number'>
                                            <i class="fa-sharp fa-solid fa-star"></i>
                                            <h4>{spot.avgStarRating}</h4>
                                            <h4 className='pushLeft'>{reviewNum(spot.numReviews)}</h4>
                                        </div>
                                    )}

                            </div>
                            <button className='manageButton'>Reserve</button>
                        </div>
                    </div>
                    <div>
                        {firstReview(user, reviews, spot) ? (
                            <div>
                                <div className='number'>
                                    <i class="fa-sharp fa-solid fa-star"></i>
                                    <h2>New</h2>
                                </div>
                                <p>Be the first to post a review!</p>
                            </div>
                        ) : <div>
                            <div className='number'>
                                <i class="fa-sharp fa-solid fa-star"></i>
                                {spot.avgStarRating === 'NaN' ? <h2>New</h2>: 
                                <div className='number'>
                                    <h4 className='number'>
                                     {spot.avgStarRating}   
                                    </h4>
                                    <h4 className='pushLeft'>
                                    {reviewNum(spot.numReviews)}    
                                    </h4>                                    
                                </div>}
                           
                            </div>
                        </div>
                        }

                        {postReviewButton(user, reviews, spot) ?
                            <OpenModalButton
                                buttonText='Post a review'
                                modalComponent={<CreateReviewModal spot={spot} />}
                            /> : null
                        }
                    </div>
                </div>
                <div>

                    <div>
                        {reviews.map((review) => (
                            <div>
                                <h4 className="reviewer">{review.User.firstName}</h4>
                                <p className="reviewTime">{reviewMonthYear(review.createdAt)}</p>
                                <p className="reviewContent">{review.review}</p>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SpotShow