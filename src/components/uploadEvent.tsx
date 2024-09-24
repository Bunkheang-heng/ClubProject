'use client';

import React, { useState, Fragment } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaCalendarPlus, FaClock, FaMapMarkerAlt, FaFileImage, FaInfoCircle } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

export default function AdminCreateEvent() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
      closeModal();
    } catch (error) {
      setError('Error creating event: ' + (error as Error).message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="group relative mt-10 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10">Create New Event</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left"></span>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-3xl font-extrabold leading-9 text-gray-900 mb-8 text-center"
                  >
                    Create New Event
                  </Dialog.Title>
                  <div className="mt-4">
                    {success && (
                      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                        <p className="font-bold">Success!</p>
                        <p>{success}</p>
                      </div>
                    )}
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    )}
                    <form onSubmit={handleCreateEvent} className="space-y-8">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                        <div className="relative">
                          <FaCalendarPlus className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                            placeholder="Enter event title"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                          <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                          <div className="relative">
                            <FaClock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="time"
                              id="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                            placeholder="Enter event location"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <div className="relative">
                          <FaInfoCircle className="absolute top-3 left-3 text-gray-400" />
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                            rows={4}
                            placeholder="Enter event description"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <div className="relative">
                          <FaFileImage className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base transition-all duration-300"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>
                      <div className="mt-8">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Create Event
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
