'use client';

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaCalendarPlus, FaClock, FaMapMarkerAlt, FaFileImage, FaInfoCircle } from 'react-icons/fa';

export default function AdminCreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      await addDoc(collection(db, 'events'), {
        title,
        date,
        time,
        location,
        description,
        image,
      });
      setSuccess('Event created successfully!');
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setImage('');
    } catch (error) {
      setError('Error creating event: ' + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Create New Event</h1>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Success!</p>
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleCreateEvent} className="space-y-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Event Title</label>
            <div className="relative">
              <FaCalendarPlus className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-10 mt-1 block text-black w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter event title"
                required
              />
            </div>
          </div>
          <div className="flex-1 mt-4 md:mt-0">
            <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">Event Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full text-black px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="time" className="block text-lg font-medium text-gray-700 mb-2">Event Time</label>
            <div className="relative">
              <FaClock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 mt-1 block text-black w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex-1 mt-4 md:mt-0">
        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter event location"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
          <div className="relative">
            <FaInfoCircle className="absolute top-3 left-3 text-gray-400" />
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-10 mt-1 block text-black w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={4}
              placeholder="Enter event description"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2">Image URL</label>
          <div className="relative">
            <FaFileImage className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="pl-10 mt-1 block text-black w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter image URL"
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
