import React from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutUs() {
  const mentors = [
    { name: "John Doe", role: "Web Development Lead", image: "/images/mentor1.jpg" },
    { name: "Jane Smith", role: "Mobile App Specialist", image: "/images/mentor2.jpg" },
    { name: "Mike Johnson", role: "Data Science Expert", image: "/images/mentor3.jpg" },
    { name: "Emily Brown", role: "AI Research Lead", image: "/images/mentor4.jpg" },
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow">
        <div className="bg-white shadow-lg rounded-xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-green-800">About ByteBuilders Club</h1>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <Image src="https://www.codingdojo.com/blog/wp-content/uploads/Can-Anyone-Really-Learn-How-to-Code_cover-01.jpg" alt="ByteBuilders Club members" width={500} height={300} className="rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2">
              <p className="mb-4 text-lg">ByteBuilders Club is a vibrant community of passionate coders and technology enthusiasts. Founded in 2020, we&apos;ve grown into a diverse group with members from various backgrounds and skill levels.</p>
              <p className="mb-4 text-lg">Our mission is to empower students with the skills and knowledge they need to excel in the ever-evolving field of technology.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-green-700">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Engaging workshops and coding sessions</li>
                <li>Collaborative projects</li>
                <li>Mentorship from industry professionals</li>
                <li>Hands-on learning experiences</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Our Focus Areas</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Web development</li>
                <li>Mobile app creation</li>
                <li>Data science</li>
                <li>Artificial intelligence</li>
                <li>Soft skills development</li>
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Our Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
                  <Image src={mentor.image} alt={mentor.name} width={200} height={200} className="rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.role}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mb-6 text-lg text-center">Whether you&apos;re a beginner or an experienced coder, ByteBuilders Club has something for everyone. Join us to explore the exciting world of programming, develop your problem-solving skills, and connect with like-minded individuals who share your passion for technology.</p>
          <div className="text-center mt-8">
            <Link href="/events" legacyBehavior>
              <a className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                View Upcoming Events
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
