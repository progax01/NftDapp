import React from 'react';
import styled from 'styled-components';
 
import Layout from '../component/Layout';

const DashboardContainer = styled.div`
  padding-top: 10px; /* Adjust for the navbar height */
`;

const DashboardPage = () => {
  return (
    <Layout>
      <DashboardContainer>
        {/* Your dashboard content goes here */}
        <h1>NFT Market Place</h1>
       
      </DashboardContainer>
    </Layout>
  );
};

export default DashboardPage;