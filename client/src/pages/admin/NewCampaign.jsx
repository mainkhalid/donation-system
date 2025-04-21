import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CampaignForm from '../../components/admin/CampaignForm';

const NewCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Log FormData content for testing
      console.log('FormData content:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File object' : pair[1]));
      }

      // Upload image to Cloudinary first if there's an image
      let imageCover = 'default-cover.jpg'; // Default value from schema
      const imageFile = formData.get('image');
      
      if (imageFile && imageFile instanceof File) {
        const cloudinaryData = new FormData();
        cloudinaryData.append('file', imageFile);
        cloudinaryData.append('upload_preset', 'campaign_image'); 
        
        const cloudinaryResponse = await fetch(
          'https://api.cloudinary.com/v1_1/djy5khmqn/image/upload', 
          {
            method: 'POST',
            body: cloudinaryData,
          }
        );
        
        const cloudinaryResult = await cloudinaryResponse.json();
        imageCover = cloudinaryResult.secure_url;
        
        console.log('Cloudinary upload result:', cloudinaryResult);
      }
      
      // Extract beneficiaries from formData
      const beneficiaries = [];
      for (let [key, value] of formData.entries()) {
        if (key.startsWith('beneficiaries[') && value.trim()) {
          beneficiaries.push(value.trim());
        }
      }
      
      // Extract location data
      const location = {
        type: 'Point',
        coordinates: [0, 0], // Default coordinates, update if you add map selection feature
        address: formData.get('location[address]') || '',
        city: formData.get('location[city]') || '',
        country: formData.get('location[country]') || ''
      };
      
      // Create campaign object with all form data
      const campaignData = {
        title: formData.get('title'),
        description: formData.get('description'),
        detailedStory: formData.get('detailedStory'),
        category: formData.get('category'),
        targetAmount: parseFloat(formData.get('targetAmount')),
        currentAmount: 0, // Initialize with 0
        startDate: new Date(formData.get('startDate')),
        endDate: new Date(formData.get('endDate')),
        isActive: formData.get('isActive') === 'true',
        imageCover: imageCover, // Cloudinary URL - match schema field name
        beneficiaries: beneficiaries,
        location: location,
        createdBy: user._id
      };
      
      console.log('Final campaign data being sent to API:', campaignData);
      
      // Submit campaign to your API
      const response = await api.post('/campaigns', campaignData);
      
      // Navigate with state to trigger refresh on campaigns page
      navigate('/admin/campaigns', { 
        state: { refreshCampaigns: true } 
      });
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <CampaignForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialValues={{
          title: '',
          description: '',
          detailedStory: '',
          category: '',
          targetAmount: 1000,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          image: null,
          isActive: true,
          beneficiaries: [''], // Add at least one empty beneficiary field
          location: {
            address: '',
            city: '',
            country: ''
          }
        }}
      />
    </div>
  );
};

export default NewCampaign;