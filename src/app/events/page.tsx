'use client';

import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { db } from '../../firebase'; // Ensure your Firebase setup is here
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';


interface Event {
  title: string;
  image: string; 
  description: string;
  date: string;
  time: string;
  location: string;
  id: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]); // Specify the type here
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Update state type

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title, 
          image: doc.data().image, // Ensure to include image
          description: doc.data().description, // {{ edit_1 }}
          date: doc.data().date,               // {{ edit_2 }}
          time: doc.data().time,               // {{ edit_3 }}
          location: doc.data().location         // {{ edit_4 }}
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Upcoming Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
              whileHover={{ y: -5 }}
              onClick={() => handleEventClick(event)}
            >
              <Image src={event.image} alt={event.title} width={400} height={200} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-indigo-700">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendar className="mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <FaClock className="mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />

      {/* Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full"
          >
            <h2 className="text-3xl font-bold mb-4 text-indigo-800">{selectedEvent.title}</h2>
            <Image src={selectedEvent.image} alt={selectedEvent.title} width={800} height={400} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
            <div className="flex items-center text-gray-600 mb-2">
              <FaCalendar className="mr-2" />
              <span>{selectedEvent.date}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <FaClock className="mr-2" />
              <span>{selectedEvent.time}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="mr-2" />
              <span>{selectedEvent.location}</span>
            </div>
            <button
              onClick={closeModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
