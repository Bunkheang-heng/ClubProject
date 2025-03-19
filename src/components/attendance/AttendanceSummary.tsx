'use client'
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { AttendanceRecord } from '@/types/teacher';

interface AttendanceSummaryProps {
  records: AttendanceRecord[];
  timeRange: 'week' | 'month' | 'all';
  title?: string;
}

const COLORS = ['#4ade80', '#f87171', '#facc15']; // green, red, yellow

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ 
  records, 
  timeRange = 'week',
  title = 'Attendance Summary'
}) => {
  // Filter records based on time range
  const filteredRecords = useMemo(() => {
    if (timeRange === 'all') return records;
    
    const today = new Date();
    const startDate = timeRange === 'week' 
      ? subDays(today, 7) 
      : subDays(today, 30);
    
    return records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startDate;
    });
  }, [records, timeRange]);

  // Calculate attendance statistics
  const stats = useMemo(() => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0
    };
    
    filteredRecords.forEach(record => {
      if (record.attendance in counts) {
        counts[record.attendance as keyof typeof counts]++;
      }
    });
    
    const total = counts.present + counts.absent + counts.late;
    
    return {
      counts,
      total,
      presentRate: total ? Math.round((counts.present / total) * 100) : 0,
      absentRate: total ? Math.round((counts.absent / total) * 100) : 0,
      lateRate: total ? Math.round((counts.late / total) * 100) : 0
    };
  }, [filteredRecords]);

  // Data for pie chart
  const chartData = useMemo(() => [
    { name: 'Present', value: stats.counts.present },
    { name: 'Absent', value: stats.counts.absent },
    { name: 'Late', value: stats.counts.late }
  ], [stats.counts]);

  // Format date range for display
  const dateRangeText = useMemo(() => {
    const today = new Date();
    
    if (timeRange === 'week') {
      const startDate = subDays(today, 7);
      return `${format(startDate, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
    }
    
    if (timeRange === 'month') {
      const startDate = subDays(today, 30);
      return `${format(startDate, 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
    }
    
    return 'All Time';
  }, [timeRange]);

  // If there's no data, show a message
  if (stats.total === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-center text-gray-500 py-8">No attendance data available for this period.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{dateRangeText}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-xl font-bold text-green-600">{stats.counts.present}</p>
          <p className="text-sm text-green-600">{stats.presentRate}%</p>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-xl font-bold text-red-600">{stats.counts.absent}</p>
          <p className="text-sm text-red-600">{stats.absentRate}%</p>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Late</p>
          <p className="text-xl font-bold text-yellow-600">{stats.counts.late}</p>
          <p className="text-sm text-yellow-600">{stats.lateRate}%</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} records`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default memo(AttendanceSummary); 