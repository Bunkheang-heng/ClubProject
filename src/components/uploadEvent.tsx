'use client';

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaCalendarPlus, FaClock, FaMapMarkerAlt, FaFileImage, FaInfoCircle } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';

export default function AdminCreateEvent() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'events'), {
        title,
        date,
        time,
        location,
        description,
        image: image || 'https://placehold.co/600x400?text=ByteBuilder+Event',
        createdAt: new Date()
      });
      
      toast.success('Event created successfully!');
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setImage('');
      closeModal();
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex justify-center rounded-md bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-medium text-white hover:from-primary-dark hover:to-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
      >
        <FaCalendarPlus className="mr-2 text-lg" />
        Create New Event
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 mb-4"
                  >
                    Create New Event
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Event Title
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                            placeholder="Enter event title"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaCalendarPlus className="text-gray-400" />
                            </div>
                            <input
                              type="date"
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaClock className="text-gray-400" />
                            </div>
                            <input
                              type="time"
                              id="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                            placeholder="Event location"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                            <FaInfoCircle className="text-gray-400" />
                          </div>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                            placeholder="Event description"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL (optional)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaFileImage className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="pl-10 block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-base transition-all duration-300"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>
                      <div className="mt-8">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-base font-medium text-white shadow-sm hover:from-primary-dark hover:to-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light focus-visible:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1"
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
