import { useState } from 'react';
import { FaUserGraduate, FaFileExcel, FaTrash, FaFilter, FaCalendarAlt, FaList, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AttendanceRecord } from '@/types/teacher';
import * as XLSX from 'xlsx';

interface AttendanceManagementProps {
  attendanceRecords: AttendanceRecord[];
  classNames: {[key: string]: string};
  onDeleteAttendance: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

type Tab = 'view' | 'manage';

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  attendanceRecords,
  classNames,
  onDeleteAttendance,
  selectedDate,
  onDateChange,
}) => {
  const [filterDate, setFilterDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('view');

  const handleFilterDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const clearFilter = () => {
    setFilterDate('');
  };

  const downloadAttendanceAsExcel = () => {
    try {
      // Format data for better Excel appearance and organization
      const formattedRecords = attendanceRecords.map(record => {
        // Convert Date object to formatted string
        const recordDate = record.timestamp.toLocaleDateString();
        const recordTime = record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        return {
          'Student Name': record.name,
          'Student ID': record.studentId,
          'Status': record.attendance,
          'Course': classNames[record.studentClass] || record.studentClass,
          'Date': recordDate,
          'Time': recordTime,
        };
      });
      
      // Create worksheet and format headers
      const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 25 }, // Student Name
        { wch: 15 }, // Student ID
        { wch: 10 }, // Status
        { wch: 25 }, // Course
        { wch: 15 }, // Date
        { wch: 10 }, // Time
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Records");
      
      // Create filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `attendance_records_${dateStr}.xlsx`;
      
      // Export file
      XLSX.writeFile(workbook, filename);
      
      // Show success notification (if available)
      if (window.toast) {
        window.toast.success("Attendance records exported successfully");
      }
    } catch (error) {
      console.error("Error exporting attendance data:", error);
      if (window.toast) {
        window.toast.error("Failed to export attendance records");
      }
    }
  };

  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    if (!filterDate) return true;
    
    const filterDateObj = new Date(filterDate);
    filterDateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    
    return record.timestamp >= filterDateObj && record.timestamp < nextDay;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-3xl font-bold mb-6 flex items-center text-primary">
        <FaUserGraduate className="mr-3" /> Attendance Management
      </h3>

      {/* Tab Navigation - Modern Design */}
      <div className="flex gap-4 mb-8 bg-gray-100 p-1.5 rounded-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('view')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'view' 
              ? 'bg-white text-primary shadow-md' 
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <FaChartBar /> View Attendance
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('manage')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'manage' 
              ? 'bg-white text-primary shadow-md' 
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <FaTrash /> Manage Records
        </motion.button>
      </div>

      {/* View Attendance Tab */}
      {activeTab === 'view' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <div className="flex items-center gap-3 flex-grow">
              <FaFilter className="text-primary" />
              <input
                type="date"
                value={filterDate}
                onChange={handleFilterDateChange}
                className="flex-1 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Filter by date"
              />
              {filterDate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilter}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadAttendanceAsExcel}
              className="bg-accent hover:bg-primary-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <FaFileExcel /> Export
            </motion.button>
          </div>

          {filteredAttendanceRecords.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-primary-light text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Student ID</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Course</th>
                    <th className="py-4 px-6 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendanceRecords.map((record, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                      <td className="py-4 px-6">{record.name}</td>
                      <td className="py-4 px-6">{record.studentId}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          record.attendance === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.attendance}
                        </span>
                      </td>
                      <td className="py-4 px-6">{classNames[record.studentClass] || record.studentClass}</td>
                      <td className="py-4 px-6">{record.timestamp.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <FaUserGraduate className="text-6xl mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-500">
                {filterDate ? 
                  `No attendance records found for ${new Date(filterDate).toLocaleDateString()}.` : 
                  "No attendance records available."
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manage Records Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-xl border border-red-200 shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-700 mb-2">Delete Attendance Records</h4>
                <p className="text-red-600 mb-4">
                  Warning: This action permanently removes attendance records and cannot be undone. 
                  Please select a date to delete all attendance records for that day.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label htmlFor="delete-date" className="block text-gray-700 font-medium mb-2">
                Select Date to Delete Records
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="delete-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onDeleteAttendance}
                  disabled={!selectedDate}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                    selectedDate 
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaTrash /> Delete Records
                </motion.button>
              </div>
            </div>
          </div>

          {/* Show selected date records */}
          {selectedDate && (
            <div className="mt-8">
              <h4 className="text-xl font-bold text-indigo-800 mb-4">
                Records for {new Date(selectedDate).toLocaleDateString()}
              </h4>
              
              {/* Filter records for the selected date */}
              {(() => {
                const dateToDelete = new Date(selectedDate);
                const startOfDay = new Date(dateToDelete);
                startOfDay.setHours(0, 0, 0, 0);
                
                const endOfDay = new Date(dateToDelete);
                endOfDay.setHours(23, 59, 59, 999);
                
                const recordsForSelectedDate = attendanceRecords.filter(record => 
                  record.timestamp >= startOfDay && record.timestamp <= endOfDay
                );
                
                if (recordsForSelectedDate.length === 0) {
                  return (
                    <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                      <p className="text-gray-500 text-lg">No attendance records found for this date.</p>
                    </div>
                  );
                }
                
                return (
                  <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden shadow-md">
                    <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex justify-between items-center">
                      <span className="font-medium text-indigo-800">
                        {recordsForSelectedDate.length} record(s) will be deleted
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          <tr>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Student ID</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Course</th>
                            <th className="py-3 px-6 text-left">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recordsForSelectedDate.map((record, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'} hover:bg-indigo-100 transition-colors`}>
                              <td className="py-3 px-6">{record.name}</td>
                              <td className="py-3 px-6">{record.studentId}</td>
                              <td className="py-3 px-6">
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  record.attendance === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.attendance}
                                </span>
                              </td>
                              <td className="py-3 px-6">{classNames[record.studentClass] || record.studentClass}</td>
                              <td className="py-3 px-6">{record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement; 