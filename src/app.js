import './App.css';
import React, { useState, useEffect } from 'react';
import Card from './Card';
import styled from 'styled-components';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [dataItems, setDataItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDataItems([]);
      setCurrentPage(1);
      setDebouncedSearchTerm(searchTerm);
    }, 250);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [searchTerm]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://4qqehgtmzp6blji4gsb6gbz6zy0srutg.lambda-url.us-east-1.on.aws/?keyword=${debouncedSearchTerm}&page=${currentPage}`);
      const data = await response.json();

      setDataItems(dataItems.concat(data.results));
      setTotalCount(data.totalResults);
    }

    fetchData();
  }, [debouncedSearchTerm, currentPage]);

  return (
    <div className="container">
      <Header>
        <SearchBarContainer>
          <SearchIcon className="material-icons">search</SearchIcon>
          <SearchBar type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" />
        </SearchBarContainer>
      </Header>
      <ResultsContainer>
        <ResultsContainerInner>
            <ResultsHeader>Results</ResultsHeader>
            <ResultsHeaderShowing>Showing {dataItems.length} of {totalCount}</ResultsHeaderShowing>
          <ResultsInner>
            { dataItems.map(x => (<Card key={x.id} laptop={x} />)) }
          </ResultsInner>
          <ResultsFooter>
          { dataItems.length < totalCount && <ResultsShowMore onClick={() => { setCurrentPage(currentPage + 1) }}>Show More</ResultsShowMore>}
          </ResultsFooter>
        </ResultsContainerInner>
      </ResultsContainer>
      <Footer />
    </div>
  );
}

export default App;


// header
const Header = styled.div`
  height: 105px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-left: -35px;
`;
const SearchBarContainer = styled.div`
  max-width: 1410px;
  width: 100%;
`;
const SearchBar = styled.input`
  width: 100%;
  background-color: #f2f2f2;
  border: none;
  height: 40px;
  border-radius: 20px;
  padding-left: 45px;
`;
const SearchIcon = styled.span`
  color: gray;
  position: relative;
  top: 35px;
  left: 15px;
`;

const ResultsContainer = styled.div`
  background-color: #f2f2f2;
  box-shadow: 0 0 1px 0;
  width: 100%;
`;
const ResultsContainerInner  = styled.div`
  max-width: 1485px;
  margin-right: auto;
  margin-left: auto;
`;

const ResultsInner = styled.div`
  background-color: #F2F2F4;
  display: flex;
  flex-flow: row wrap;
  width: 1485px;
  margin-left: -10px;
  align-items: flex-start;
`;

const ResultsFooter = styled.div`

`;

const ResultsHeader = styled.div`
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 10px;
  padding-top: 20px;
`;

const ResultsHeaderShowing = styled.div`
  color: gray;
  font-size: 16px;
  text-shadow: 0 3px 5px #9b9b9b;
  margin: 10px 0 20px 0;
`;

const ResultsShowMore = styled.div`
  color: #1fc068;
  font-size: 22px;
  text-align: center;
  margin-top: 30px;
  font-weight: 500;
  cursor: pointer;
`;

const Footer = styled.div`
  min-height: 200px;
  background-color: #F2F2F4;
`;
