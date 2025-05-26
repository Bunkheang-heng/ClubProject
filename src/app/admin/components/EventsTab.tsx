'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { FaCalendarPlus, FaEdit, FaTrash, FaImage, FaCalendarAlt } from 'react-icons/fa';
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
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Event Management</h2>
            <p className="text-gray-400 text-lg">Organize and manage your school events</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <span>{events.length} Total Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>{events.filter(event => new Date(event.date) >= new Date()).length} Upcoming</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <AdminCreateEvent />
          </div>
        </div>
      </motion.div>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const isUpcoming = new Date(event.date) >= new Date();
          
          return (
            <motion.div 
              key={event.id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-2xl hover:shadow-2xl hover:border-gray-500 transition-all duration-500 overflow-hidden group"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  {event.image ? (
                    <>
                      <Image 
                        src={event.image} 
                        alt={event.title} 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-600/20 to-orange-600/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaCalendarAlt className="text-2xl text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Event status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 backdrop-blur-sm text-white text-xs font-semibold rounded-full ${
                      isUpcoming 
                        ? 'bg-emerald-600/90' 
                        : 'bg-gray-600/90'
                    }`}>
                      {isUpcoming ? '📅 Upcoming' : '📋 Past Event'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Event Title */}
                  <h3 className="text-xl font-bold mb-3 text-white line-clamp-2 group-hover:text-rose-300 transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg border border-gray-600/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📅</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Date</span>
                        <p className="text-white font-medium text-sm">{event.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg border border-gray-600/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🕐</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Time</span>
                        <p className="text-white font-medium text-sm">{event.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg border border-gray-600/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📍</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Location</span>
                        <p className="text-white font-medium text-sm">{event.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Description */}
                  <p className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-600/50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-blue-600/30"
                    >
                      <FaEdit className="text-xs" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-red-600/30"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Empty State */}
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-full text-center py-16"
          >
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-12 border border-gray-600 max-w-md mx-auto relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <FaCalendarAlt className="text-3xl text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-3">No Events Yet</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">Start organizing your school calendar by creating your first event.</p>
                
                <div className="text-center">
                  <AdminCreateEvent />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-3xl max-w-lg w-full p-0 overflow-hidden shadow-2xl relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 rounded-full translate-y-10 -translate-x-10"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl z-20 transition-colors duration-200"
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-600 pb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Edit Event</h3>
                  <p className="text-gray-400 text-sm">Update your event information</p>
                </div>
              </div>
            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-title">
                  Event Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-date">
                    Date
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-time">
                    Time
                  </label>
                  <input
                    id="edit-time"
                    type="time"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-location">
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="edit-image">
                  Image URL (optional)
                </label>
                <input
                  id="edit-image"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-600">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600 rounded-xl text-gray-300 transition-all duration-200 border border-gray-500 backdrop-blur-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <FaEdit className="text-sm" />
                  Update Event
                </motion.button>
              </div>
            </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventsTab; 