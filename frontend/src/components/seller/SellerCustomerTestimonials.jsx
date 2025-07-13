/**
 * SellerCustomerTestimonials.jsx
 * Path: frontend/src/components/seller/SellerCustomerTestimonials.jsx
 * Purpose: Showcase seller testimonials from past buyers in animated cards with optional carousel.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerCustomerTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/testimonials', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTestimonials(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load testimonials');
        setIsLoading(false);
        toast.error('Error loading testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 5) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Testimonials</h1>
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/empty-testimonials.svg"
              alt="No testimonials"
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">No testimonials yet. Keep up the great work!</p>
          </div>
        ) : testimonials.length <= 5 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
                aria-label={`Testimonial from ${testimonial.name}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">🌟</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full sm:min-w-[50%] lg:min-w-[33.33%] px-2"
                >
                  <div
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    aria-label={`Testimonial from ${testimonial.name}`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl">🌟</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(testimonial.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerCustomerTestimonials;