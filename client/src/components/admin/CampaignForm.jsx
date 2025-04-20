import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CampaignForm = ({ onSubmit, isSubmitting, initialValues }) => {
  const [previewImage, setPreviewImage] = useState(null);
  
  // Match categories from the Mongoose schema
  const categories = [
    'education',
    'medical',
    'environment',
    'animals',
    'disaster-relief',
    'community',
    'other'
  ];

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title cannot be more than 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(500, 'Description cannot be more than 500 characters'),
    detailedStory: Yup.string()
      .required('Full story is required'),
    category: Yup.string()
      .required('Please select a category')
      .oneOf(categories, 'Please select a valid category'),
    targetAmount: Yup.number()
      .min(100, 'Minimum target amount is $100')
      .required('Target amount is required'),
    startDate: Yup.date()
      .required('Start date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required('End date is required'),
    image: Yup.mixed()
      .required('Image is required'),
    beneficiaries: Yup.array()
      .min(1, 'Please specify at least one beneficiary')
      .required('Please specify who will benefit'),
  });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      beneficiaries: initialValues.beneficiaries || [''],
      location: initialValues.location || {
        address: '',
        city: '',
        country: ''
      }
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      
      // Add simple fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'image' && key !== 'beneficiaries' && key !== 'location' && 
            value !== null && value !== undefined) {
          // Handle date objects specially
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value);
          }
        }
      });
      
      // Handle image
      if (values.image) {
        formData.append('image', values.image);
      }
      
      // Handle beneficiaries array
      values.beneficiaries.forEach((beneficiary, index) => {
        if (beneficiary.trim()) {
          formData.append(`beneficiaries[${index}]`, beneficiary);
        }
      });
      
      // Handle location object
      Object.entries(values.location).forEach(([key, value]) => {
        if (value) {
          formData.append(`location[${key}]`, value);
        }
      });
      
      onSubmit(formData);
    },
  });

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddBeneficiary = () => {
    formik.setFieldValue('beneficiaries', [...formik.values.beneficiaries, '']);
  };
  
  const handleRemoveBeneficiary = (index) => {
    const newBeneficiaries = [...formik.values.beneficiaries];
    newBeneficiaries.splice(index, 1);
    formik.setFieldValue('beneficiaries', newBeneficiaries);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Title *
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={100}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formik.values.title.length}/100 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            className="w-full p-2 border rounded"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount ($) *
          </label>
          <input
            type="number"
            name="targetAmount"
            min="100"
            step="1"
            className="w-full p-2 border rounded"
            value={formik.values.targetAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.targetAmount && formik.errors.targetAmount && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.targetAmount}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <DatePicker
            selected={formik.values.startDate}
            onChange={(date) => formik.setFieldValue('startDate', date)}
            selectsStart
            startDate={formik.values.startDate}
            endDate={formik.values.endDate}
            className="w-full p-2 border rounded"
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <DatePicker
            selected={formik.values.endDate}
            onChange={(date) => formik.setFieldValue('endDate', date)}
            selectsEnd
            startDate={formik.values.startDate}
            endDate={formik.values.endDate}
            minDate={formik.values.startDate}
            className="w-full p-2 border rounded"
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.endDate}</p>
          )}
        </div>

        {/* Location - Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="location.address"
            className="w-full p-2 border rounded"
            value={formik.values.location.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Location - City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="location.city"
            className="w-full p-2 border rounded"
            value={formik.values.location.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Location - Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="location.country"
            className="w-full p-2 border rounded"
            value={formik.values.location.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Image *
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                onBlur={formik.handleBlur}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This will be the cover image for your campaign
              </p>
            </div>
            {previewImage && (
              <div className="w-20 h-20 rounded overflow-hidden border">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Description (Short) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description *
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full p-2 border rounded"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="A brief summary of your campaign (will appear in listings)"
            maxLength={500}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formik.values.description.length}/500 characters
          </p>
        </div>

        {/* Detailed Story */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Story *
          </label>
          <textarea
            name="detailedStory"
            rows={8}
            className="w-full p-2 border rounded"
            value={formik.values.detailedStory}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Share the complete details of your campaign. What's the purpose? Who will benefit? How will the funds be used?"
          />
          {formik.touched.detailedStory && formik.errors.detailedStory && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.detailedStory}</p>
          )}
        </div>

        {/* Beneficiaries */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beneficiaries *
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Please specify who will benefit from this campaign
          </p>
          
          {formik.values.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name={`beneficiaries[${index}]`}
                className="flex-1 p-2 border rounded"
                value={beneficiary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Local school children, Wildlife sanctuary"
              />
              
              {formik.values.beneficiaries.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveBeneficiary(index)}
                >
                  <span className="text-xl">×</span>
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="mt-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            onClick={handleAddBeneficiary}
          >
            + Add another beneficiary
          </button>
          
          {formik.touched.beneficiaries && formik.errors.beneficiaries && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.beneficiaries}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formik.values.isActive}
            onChange={formik.handleChange}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Activate campaign immediately
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;