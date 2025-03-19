'use client'
import React, { memo, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaFilter, FaSort, FaDownload, FaTrash, FaCalendarAlt, FaChartBar, FaFileExcel } from 'react-icons/fa';
import { AttendanceRecord } from '@/types/teacher';
import Spinner from '@/components/ui/Spinner';
import { exportToExcel } from '@/utils/excelExport';

interface AttendanceListProps {
  records: AttendanceRecord[];
  classNames: Record<string, string>;
  isLoading?: boolean;
  onDeleteRecord?: (id: string) => Promise<void>;
}

// Statuses with their corresponding colors
const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800 border-green-200',
  absent: 'bg-red-100 text-red-800 border-red-200',
  late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

// Memoized status badge component
const StatusBadge = memo(({ status }: { status: string }) => {
  const colorClasses = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClasses} capitalize`}>
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized record row component for better performance with many records
const AttendanceRow = memo(({ 
  record, 
  className, 
  onDelete 
}: { 
  record: AttendanceRecord; 
  className: string;
  onDelete?: (id: string) => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(record.id);
    } finally {
      setIsDeleting(false);
    }
  }, [record.id, onDelete]);
  
  // Format date in a readable format
  const formattedDate = useMemo(() => {
    return format(record.timestamp, 'MMMM d, yyyy - h:mm a');
  }, [record.timestamp]);

  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {record.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {record.studentId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {className}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          {formattedDate}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={record.attendance} />
      </td>
      {onDelete && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
            disabled={isDeleting}
            aria-label="Delete record"
          >
            {isDeleting ? <Spinner size="sm" /> : <FaTrash />}
          </button>
        </td>
      )}
    </motion.tr>
  );
});

AttendanceRow.displayName = 'AttendanceRow';

const AttendanceList: React.FC<AttendanceListProps> = ({ 
  records, 
  classNames, 
  isLoading = false,
  onDeleteRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState({ field: 'timestamp', direction: 'desc' as 'asc' | 'desc' });
  
  // Get unique classes for filtering
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(records.map(record => record.studentClass))];
    return classes.sort();
  }, [records]);
  
  // Get unique dates for filtering
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(records.map(record => 
      record.timestamp.toISOString().split('T')[0]
    ))];
    return dates.sort().reverse();
  }, [records]);
  
  // Handle sorting
  const handleSort = useCallback((field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);
  
  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    // First filter
    let filtered = records.filter(record => {
      const matchesSearch = 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter ? record.attendance === statusFilter : true;
      const matchesClass = classFilter ? record.studentClass === classFilter : true;
      const matchesDate = dateFilter 
        ? record.timestamp.toISOString().split('T')[0] === dateFilter 
        : true;
      
      return matchesSearch && matchesStatus && matchesClass && matchesDate;
    });
    
    // Then sort
    return filtered.sort((a, b) => {
      const field = sortBy.field as keyof AttendanceRecord;
      
      if (field === 'timestamp') {
        return sortBy.direction === 'asc' 
          ? a.timestamp.getTime() - b.timestamp.getTime() 
          : b.timestamp.getTime() - a.timestamp.getTime();
      }
      
      const aVal = a[field]?.toString().toLowerCase() || '';
      const bVal = b[field]?.toString().toLowerCase() || '';
      
      return sortBy.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [records, searchTerm, statusFilter, classFilter, dateFilter, sortBy]);
  
  // Export to Excel
  const handleExport = useCallback(() => {
    if (filteredAndSortedRecords.length === 0) return;
    
    // Format data for Excel
    const headers = [
      'Student Name', 
      'Student ID', 
      'Class', 
      'Date', 
      'Time', 
      'Status'
    ];
    
    const data = filteredAndSortedRecords.map(record => [
      record.name,
      record.studentId,
      classNames[record.studentClass] || record.studentClass,
      format(record.timestamp, 'yyyy-MM-dd'),
      format(record.timestamp, 'HH:mm:ss'),
      record.attendance
    ]);
    
    // Filename with date range
    let filename = 'Attendance_Report';
    if (dateFilter) {
      filename += `_${dateFilter}`;
    } else {
      const firstDate = format(
        new Date(Math.min(...filteredAndSortedRecords.map(r => r.timestamp.getTime()))), 
        'yyyy-MM-dd'
      );
      const lastDate = format(
        new Date(Math.max(...filteredAndSortedRecords.map(r => r.timestamp.getTime()))), 
        'yyyy-MM-dd'
      );
      
      if (firstDate !== lastDate) {
        filename += `_${firstDate}_to_${lastDate}`;
      } else {
        filename += `_${firstDate}`;
      }
    }
    
    exportToExcel(headers, data, filename);
  }, [filteredAndSortedRecords, classNames, dateFilter]);
  
  // Attendance summary stats
  const attendanceSummary = useMemo(() => {
    const total = filteredAndSortedRecords.length;
    const present = filteredAndSortedRecords.filter(r => r.attendance === 'present').length;
    const absent = filteredAndSortedRecords.filter(r => r.attendance === 'absent').length;
    const late = filteredAndSortedRecords.filter(r => r.attendance === 'late').length;
    
    return {
      total,
      present,
      absent,
      late,
      presentPercent: total ? Math.round((present / total) * 100) : 0,
      absentPercent: total ? Math.round((absent / total) * 100) : 0,
      latePercent: total ? Math.round((late / total) * 100) : 0
    };
  }, [filteredAndSortedRecords]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter(null);
    setClassFilter(null);
    setDateFilter(null);
    setSortBy({ field: 'timestamp', direction: 'desc' });
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No attendance records</h3>
          <p className="mt-1 text-sm text-gray-500">Start taking attendance to see records here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FaCalendarAlt />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">{attendanceSummary.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FaChartBar />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Present</p>
              <p className="text-2xl font-semibold text-green-600">
                {attendanceSummary.present} 
                <span className="text-sm text-gray-500 ml-2">({attendanceSummary.presentPercent}%)</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <FaChartBar />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Absent</p>
              <p className="text-2xl font-semibold text-red-600">
                {attendanceSummary.absent}
                <span className="text-sm text-gray-500 ml-2">({attendanceSummary.absentPercent}%)</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <FaChartBar />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Late</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {attendanceSummary.late}
                <span className="text-sm text-gray-500 ml-2">({attendanceSummary.latePercent}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID"
              className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          
          <div>
            <select
              value={classFilter || ''}
              onChange={(e) => setClassFilter(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>
                  {classNames[cls] || cls}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={dateFilter || ''}
              onChange={(e) => setDateFilter(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {format(new Date(date), 'MMMM d, yyyy')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Reset
            </button>
            <button
              onClick={handleExport}
              disabled={filteredAndSortedRecords.length === 0}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaFileExcel className="mr-2 -ml-1 h-4 w-4" /> Export Excel
            </button>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Student Name
                  {sortBy.field === 'name' && (
                    <FaSort className={sortBy.direction === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('studentId')}
              >
                <div className="flex items-center gap-1">
                  Student ID
                  {sortBy.field === 'studentId' && (
                    <FaSort className={sortBy.direction === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('studentClass')}
              >
                <div className="flex items-center gap-1">
                  Class
                  {sortBy.field === 'studentClass' && (
                    <FaSort className={sortBy.direction === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  Date/Time
                  {sortBy.field === 'timestamp' && (
                    <FaSort className={sortBy.direction === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('attendance')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortBy.field === 'attendance' && (
                    <FaSort className={sortBy.direction === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </div>
              </th>
              {onDeleteRecord && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAndSortedRecords.length > 0 ? (
                filteredAndSortedRecords.map(record => (
                  <AttendanceRow
                    key={record.id}
                    record={record}
                    className={classNames[record.studentClass] || record.studentClass}
                    onDelete={onDeleteRecord}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={onDeleteRecord ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">No records match your filters</p>
                    <p className="text-sm mt-2">Try adjusting your search criteria or clear filters</p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
        <div>
          Showing {filteredAndSortedRecords.length} of {records.length} records
        </div>
        {filteredAndSortedRecords.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            <FaDownload className="mr-1" /> Download Report
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(AttendanceList); 