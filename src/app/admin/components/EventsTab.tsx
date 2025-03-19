'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { FaCalendarPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AdminCreateEvent from '@/components/uploadEvent';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  image: string;
}

const EventsTab: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventsData: Event[] = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title as string,
          date: doc.data().date as string,
          time: doc.data().time as string,
          description: doc.data().description as string,
          location: doc.data().location as string,
          image: doc.data().image as string,
        }));
        setEvents(eventsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
    setImage(event.image);
    setShowEditModal(true);
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    try {
      const eventRef = doc(db, 'events', selectedEvent.id);
      await updateDoc(eventRef, {
        title,
        date,
        time,
        location,
        description,
        image
      });
      
      toast.success("Event updated successfully");
      
      // Update the event in our state
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, title, date, time, location, description, image }
          : event
      ));
      
      // Reset form
      setSelectedEvent(null);
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setImage('');
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        
        toast.success("Event deleted successfully");
        
        // Remove the event from our state
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Events</h2>
        <AdminCreateEvent />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <motion.div 
            key={event.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="relative h-48 bg-gray-200">
              {event.image ? (
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaImage className="text-4xl text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.title}</h3>
              <div className="text-sm text-gray-600 mb-1">Date: {event.date}</div>
              <div className="text-sm text-gray-600 mb-1">Time: {event.time}</div>
              <div className="text-sm text-gray-600 mb-4">Location: {event.location}</div>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="text-primary hover:text-primary-dark p-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {events.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500">
            <p className="mb-4">No events found. Click the "Add Event" button to create your first event.</p>
            <FaCalendarPlus className="text-4xl mx-auto text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Edit Event</h3>
            <form onSubmit={handleEditEvent}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-date">
                    Date
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-time">
                    Time
                  </label>
                  <input
                    id="edit-time"
                    type="time"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-location">
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-image">
                  Image URL (optional)
                </label>
                <input
                  id="edit-image"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-lg"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab; 