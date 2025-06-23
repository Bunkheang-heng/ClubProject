'use client';

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaCalendarPlus, FaClock, FaMapMarkerAlt, FaFileImage, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
      <motion.button
        type="button"
        onClick={openModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-700 hover:via-rose-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 border border-rose-500/50"
      >
        <div className="p-2 bg-white/20 rounded-full">
          <FaCalendarPlus className="text-lg" />
        </div>
        <span className="text-lg">Create New Event</span>
      </motion.button>

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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 text-left align-middle shadow-2xl transition-all relative">
                  {/* Background decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
                  >
                    <FaTimes className="text-xl" />
                  </motion.button>

                  <div className="relative z-10 p-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
                      >
                        <FaCalendarPlus className="text-2xl text-white" />
                      </motion.div>
                      
                      <Dialog.Title
                        as="h3"
                        className="text-3xl font-bold text-white mb-2"
                      >
                        Create New Event
                      </Dialog.Title>
                      <p className="text-gray-400 text-lg">Fill in the details to create an amazing event</p>
                    </div>

                    <form onSubmit={handleCreateEvent} className="space-y-6">
                      {/* Event Title */}
                      <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
                          Event Title
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                            placeholder="Enter an exciting event title..."
                            required
                          />
                        </div>
                      </div>

                      {/* Date and Time Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="date" className="block text-sm font-semibold text-gray-300 mb-2">
                            Event Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaCalendarPlus className="text-gray-400 text-lg" />
                            </div>
                            <input
                              type="date"
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="time" className="block text-sm font-semibold text-gray-300 mb-2">
                            Event Time
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaClock className="text-gray-400 text-lg" />
                            </div>
                            <input
                              type="time"
                              id="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-2">
                          Event Location
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400 text-lg" />
                          </div>
                          <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                            placeholder="Where will this event take place?"
                            required
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
                          Event Description
                        </label>
                        <div className="relative">
                          <div className="absolute top-4 left-4 pointer-events-none">
                            <FaInfoCircle className="text-gray-400 text-lg" />
                          </div>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg resize-none"
                            placeholder="Describe what makes this event special..."
                            required
                          />
                        </div>
                      </div>

                      {/* Image URL */}
                      <div className="space-y-2">
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-300 mb-2">
                          Event Image URL <span className="text-gray-500 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaFileImage className="text-gray-400 text-lg" />
                          </div>
                          <input
                            type="url"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                            placeholder="https://example.com/event-image.jpg"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave empty to use a default placeholder image</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-600">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={closeModal}
                          className="px-8 py-3 bg-gray-600/50 hover:bg-gray-600 rounded-xl text-gray-300 font-medium transition-all duration-200 border border-gray-500"
                        >
                          Cancel
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-3"
                        >
                          <FaCalendarPlus className="text-lg" />
                          Create Event
                        </motion.button>
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
