'use client';

import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaCode, FaTerminal, FaChevronRight, FaTimes } from 'react-icons/fa';
import { db } from '../../firebase';
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

const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-[#1E1E1E] rounded-t-lg flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400">events@bytebuilders:~</div>
      </div>
      {children}
    </div>
  );
};

const TypewriterText = ({ text, delay = 30 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayText}<span className="animate-blink">|</span></span>;
};

const CodeSnippet = ({ code, language }: { code: string; language: string }) => {
  return (
    <div className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-700 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-xs text-gray-400 ml-2">{language}</span>
      </div>
      <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  const eventCode = `class Event {\n  constructor() {\n    this.title = \"${event.title}\";\n    this.date = \"${event.date}\";\n    this.time = \"${event.time}\";\n    this.location = \"${event.location}\";\n  }\n\n  async register() {\n    await this.validate();\n    return this.confirm();\n  }\n}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
      }}
      className="bg-[#252526] rounded-lg border-2 border-green-400 overflow-hidden cursor-pointer group transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative">
        <Image 
          src={event.image} 
          alt={event.title} 
          width={400} 
          height={200} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <FaCode className="text-green-400" />
          <h2 className="text-2xl font-mono font-bold text-green-400">{event.title}</h2>
        </div>
        <CodeSnippet code={eventCode} language="javascript" />
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-400">
            <FaCalendar className="mr-2 text-green-400" />
            <span className="font-mono">{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <FaClock className="mr-2 text-green-400" />
            <span className="font-mono">{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-green-400" />
            <span className="font-mono">{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          image: doc.data().image,
          description: doc.data().description,
          date: doc.data().date,
          time: doc.data().time,
          location: doc.data().location
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-[#1E1E1E] text-gray-100 min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <TerminalEffect>
          <div className="bg-[#252526] shadow-2xl rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-8">
              <FaCode className="text-green-400 text-3xl" />
              <h1 className="text-4xl font-bold text-center text-green-400 font-mono">Upcoming Events</h1>
              <FaCode className="text-green-400 text-3xl" />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaTerminal className="text-green-400 text-4xl" />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>
        </TerminalEffect>
      </main>
      <Footer />

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#252526] rounded-lg p-8 max-w-2xl w-full border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <FaCode className="text-green-400 text-2xl" />
                  <h2 className="text-3xl font-bold text-green-400 font-mono">{selectedEvent.title}</h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </motion.button>
              </div>

              <div className="relative mb-6">
                <Image 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  width={800} 
                  height={400} 
                  className="w-full h-64 object-cover rounded-lg" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent opacity-60 rounded-lg"></div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 font-mono">{selectedEvent.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <FaCalendar />
                      <span className="font-mono">Date</span>
                    </div>
                    <p className="text-gray-300 font-mono">{selectedEvent.date}</p>
                  </div>
                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <FaClock />
                      <span className="font-mono">Time</span>
                    </div>
                    <p className="text-gray-300 font-mono">{selectedEvent.time}</p>
                  </div>
                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <FaMapMarkerAlt />
                      <span className="font-mono">Location</span>
                    </div>
                    <p className="text-gray-300 font-mono">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
