import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { React,  useState } from 'react';
import getKYCData from './ContractInteraction'; // Import the modified component
import Layout from '../component/Layout';
function ViewKyc() {
  const [address, setAddress] = useState('');
  const [userInformation, setUserInformation] = useState(null);
  const [error, setError] = useState('');
  
  const handleGetKYC = async () => {
    try {
      if (!address) {
        toast.error('Enter an Ethereum address.', { position: 'top-right' });
        return;
      }
      // Call the getKYCData function with the provided address
      const userData = await getKYCData(address);

      if(userData){
        setUserInformation(userData);
        setError('');

      }
      else{
        setError('KYC data not found for this address. Please go and complete KYC.');
         
      }
    } catch (error) {
      console.error(error);
      
      toast.error('An error occurred enter valid address.', { position: 'top-right' });
    }
  };

  return (
    <Layout>
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">View KYC</h1>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-600 font-medium mb-1">
          Enter Ethereum Address:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleGetKYC}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
        >
          Get KYC Data
        </button>
      </div>
      {userInformation && (
        
        <div className='gap-4'>
          <h3 className="text-lg font-semibold mb-2">User Information:</h3>
          <p>Full Name: {userInformation._FullName}</p>
          <p>Email: {userInformation._Email}</p>
          <p>Phone: {(userInformation._Phone).toString()}</p>
          <p>Aadhar: {userInformation._Aadhar.toString()}</p>
          <p>Address: {userInformation._Location}</p>


          {/* Add more fields as needed */}
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
     
    </div>
    </Layout>
  );
}

export default ViewKyc;