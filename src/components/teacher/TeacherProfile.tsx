import { FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Teacher } from '@/types/teacher';

interface TeacherProfileProps {
  teacher: Teacher;
}

export default function TeacherProfile({ teacher }: TeacherProfileProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-white bg-opacity-20 rounded-full">
          <FaChalkboardTeacher className="text-5xl" />
        </div>
        <div>
          <h2 className="text-4xl font-bold">{teacher.name}</h2>
          <p className="text-xl opacity-90 mt-2">{teacher.role}</p>
        </div>
      </div>
    </div>
  );
} 