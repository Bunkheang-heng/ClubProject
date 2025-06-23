'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { FaCalendarPlus, FaEdit, FaTrash, FaImage, FaCalendarAlt, FaTimes, FaClock, FaMapMarkerAlt, FaInfoCircle, FaFileImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Loading Events</h3>
          <p className="text-gray-400">Fetching your amazing events...</p>
        </div>
        
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-rose-500 rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              Event Management
            </h2>
            <p className="text-gray-400 text-lg">
              Organize and manage your school events
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-full border border-gray-600/50">
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <span>{events.length} Total Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-full border border-gray-600/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>{events.filter(event => new Date(event.date) >= new Date()).length} Upcoming</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <AdminCreateEvent />
          </div>
        </div>
      </div>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const isUpcoming = new Date(event.date) >= new Date();
          
          return (
            <div 
              key={event.id} 
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
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-blue-600/30"
                    >
                      <FaEdit className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-red-600/30"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State */}
        {events.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-12 border border-gray-600 max-w-md mx-auto relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-500/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCalendarAlt className="text-3xl text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">No Events Yet</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">Start organizing your school calendar by creating your first event.</p>
                
                <div className="text-center">
                  <AdminCreateEvent />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 text-left align-middle shadow-2xl transition-all relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="relative z-10 p-8">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-2xl text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">Edit Event</h3>
                <p className="text-gray-400 text-lg">Update your event information</p>
              </div>

              <form onSubmit={handleEditEvent} className="space-y-6">
                {/* Event Title */}
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="edit-title"
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
                    <label htmlFor="edit-date" className="block text-sm font-semibold text-gray-300 mb-2">
                      Event Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaCalendarPlus className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type="date"
                        id="edit-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-time" className="block text-sm font-semibold text-gray-300 mb-2">
                      Event Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type="time"
                        id="edit-time"
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
                  <label htmlFor="edit-location" className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      id="edit-location"
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
                  <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FaInfoCircle className="text-gray-400 text-lg" />
                    </div>
                    <textarea
                      id="edit-description"
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
                  <label htmlFor="edit-image" className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Image URL <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaFileImage className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="url"
                      id="edit-image"
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
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-8 py-3 bg-gray-600/50 hover:bg-gray-600 rounded-xl text-gray-300 font-medium transition-all duration-200 border border-gray-500"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-3"
                  >
                    <FaEdit className="text-lg" />
                    Update Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab; 