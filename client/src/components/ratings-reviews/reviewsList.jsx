import {useState, useEffect} from 'react';
import styled from "styled-components";
import axios from 'axios';
import {TOKEN} from '/MyConfig.js';
import {ReviewTile} from './reviewTile.jsx'

const ReviewsListDiv = styled.div`

  max-height: 100vh;
  overflow: auto;
  margin: 5px;
`
const ReviewsListOuterDiv = styled.div`
  margin: 10px 0;
  padding: 10px;
  width: 70%;
  border: solid;
  border-radius: 10px;
  height: fit-content;
`

export const ReviewsList = function ({product_id, starBarFilters, searchBarTerm}) {

  const [reviews, setReviews] = useState(null)
  const [countToRender, setcountToRender] = useState(2);
  const [moreAvailable, setmoreAvailable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('relevant');

  useEffect(()=> {
    axios({
      url: `http://app-hrsei-api.herokuapp.com/api/fec2/hr-rfc/reviews/?page=${1}&count=${100000}&sort=${selectedSort}&product_id=${product_id}`,
      method: 'get',
      headers: {authorization: TOKEN}
      })
      .then((val)=> {
        let filteredReviews = val.data.results.filter((review)=> {
          return review.body.indexOf(searchBarTerm) > -1 && starBarFilters[review.rating];
        });

        setmoreAvailable(filteredReviews.length > countToRender ? true : false);
        setReviews(filteredReviews.slice(0, countToRender))

      })
      .catch((err)=> {
        alert(err);
      })
  }, [starBarFilters, countToRender, selectedSort]);

  if (!reviews || reviews.length===0) {
    return null;
  }
  //console.log(reviews)
  return (
    <ReviewsListOuterDiv>
      <label >Sort on:
        <select value={selectedSort} onChange={(e)=>{setSelectedSort(e.target.value)}}>
          {['relevant', 'helpful', 'newest'].map((item,index)=>{
            return <option value={item} key={index}>{item}</option>
          })}
        </select>
      </label>

      <ReviewsListDiv>
        <div>
          {reviews.map((review, index)=> {
            return <ReviewTile key={review.review_id} review={review}/>
          })}
        </div>

        {moreAvailable && <button onClick={()=>{setcountToRender(countToRender + 2)}}>More Reviews</button>}
      </ReviewsListDiv>
    </ReviewsListOuterDiv>
  )
}

let exampleData = [
  {
      "review_id": 1275521,
      "rating": 3,
      "summary": "",
      "recommend": true,
      "response": null,
      "body": "trying to upload photos to see if this works we shall see",
      "date": "2022-07-17T00:00:00.000Z",
      "reviewer_name": "test101",
      "helpfulness": 17,
      "photos": [
          {
              "id": 2455420,
              "url": "http://res.cloudinary.com/djgtrn3gg/image/upload/v1658081306/vfgwjvsppkowoyslzdms.png"
          }
      ]
  },
  {
      "review_id": 1276325,
      "rating": 5,
      "summary": "Michael Scott",
      "recommend": true,
      "response": null,
      "body": "'You miss 100% of the shots you never take. -Wayne Gretzky' -Michael Scott",
      "date": "2022-09-02T00:00:00.000Z",
      "reviewer_name": "Michael",
      "helpfulness": 5,
      "photos": [
          {
              "id": 2455912,
              "url": "https://miro.medium.com/max/500/1*xDIevNE7HEMiJQVTYg0qDQ.png"
          }
      ]
  }
]