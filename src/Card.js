import React from 'react';
import styled from 'styled-components';

const Card = ({ laptop }) => {
  return (
    <CardOuter>
      <CardInner>
        <CardImage src={laptop.image} />
        <CardVendor>{laptop.vendor}</CardVendor>
        <CardTitle>{laptop.title}</CardTitle>
        <PriceLabel>
          <Price striked={laptop['striked-price']}>{laptop.price}</Price>
          {laptop['striked-price'] && <StrikedPrice>{laptop['striked-price']}</StrikedPrice>}
        </PriceLabel>
        <CardHR />
        <CardIcons>
          <CardIconStyled label="Free Shipping" icon="local_shipping" />
          <CardIconStyled label="Free Gift" icon="card_giftcard" />
        </CardIcons>
        <CardViewDeal>VIEW DEAL</CardViewDeal>
      </CardInner>
    </CardOuter>
  );
};

const CardIcon = ({ label, icon }) => {
  return (
    <React.Fragment>
      <CardIconIcon className="material-icons">{ icon }</CardIconIcon>
      <CardIconLabel>{ label }</CardIconLabel>
    </React.Fragment>
  )
}

export default Card;


// card
const CardOuter = styled.div`
  background-color: white;
  width: 350px;
  height: 394px;
  border-radius: 30px;
  box-shadow: 0 2px 3px #c7c7c7;
  margin: 15px 10px;
`;
const CardInner = styled.div`
  margin: 25px;
`;
const CardImage = styled.img`
  height: 80px;
  width: 128px;
  display: block;
  margin: 33px auto 25px auto;
`;
const CardVendor = styled.p`
  font-weight: 700;
  
`;
const CardTitle = styled.p`
  width: 290px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  color: #3d3d3d;
`;
const CardHR = styled.hr`
  border: 1px solid #f2f2f2;
`;
const CardIcons = styled.div`
  display: flex;
  align-items: center;
`;
const CardViewDeal = styled.div`
  border-radius: 30px;
  background-color: #1fc068;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  cursor: pointer;
`;
const CardIconStyled = styled(CardIcon)`
  color: #f2f2f2;
`;
const CardIconLabel = styled.span`
  color: gray;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 12px;
`;
const CardIconIcon = styled.span`
  color: gray;
`;
const PriceLabel = styled.div`

`;

const Price = styled.p`
  ${props => props.striked !== null ? 'color: red' : ''};
  display: inline;
`;
const StrikedPrice = styled.p`
  color: gray;
  text-decoration: line-through;
  display: inline;
  margin-left: 5px;
  font-size: 14px;
`;